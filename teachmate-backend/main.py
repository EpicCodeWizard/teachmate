from pytesseract import pytesseract
from dotenv import dotenv_values
from openai import OpenAI
from PIL import Image
from quart import *
import cloudconvert
import requests
import tempfile
import base64
import json
import fitz
import uuid
import os
import io

app = Quart(__name__)
vectara_config = dotenv_values(".vectara.env")
cloudconvert_config = dotenv_values(".cloudconvert.env")
openai_config = dotenv_values(".openai.env")

cloudconvert.configure(api_key=cloudconvert_config["api-key"])
pytesseract.tesseract_cmd = "C:\\Users\\sarve\\Downloads\\tesseract.exe"
openai_api_key = openai_config["api-key"]
openai_client = OpenAI(api_key=openai_config["api-key"])
audio_files = {}

def create_corpus(corpus_id):
    return requests.post("https://api.vectara.io/v1/create-corpus", headers={"Content-Type": "application/json", "Accept": "application/json", "customer-id": "2698881212", "Authorization": "Bearer " + vectara_config["bearer-key"]}, data=json.dumps({"corpus": {"id": corpus_id}}))

def list_corpus():
    return requests.post("https://api.vectara.io/v1/list-corpora", headers={"Content-Type": "application/json", "Accept": "application/json", "customer-id": "2698881212", "Authorization": "Bearer " + vectara_config["bearer-key"]}, data=json.dumps({"numResults": 999}))

def upload_file_to_corpus(corpus_id, file):
    return requests.post("https://api.vectara.io/v1/upload", headers={"Content-Type": "multipart/form-data", "Accept": "application/json", "x-api-key": vectara_config["api-key"]}, data={}, files={"file": file}, params={"c": "2698881212", "o": corpus_id})

def query_corpus(corpus_id, text):
    response = requests.post("https://api.vectara.io/v1/query", headers={"Content-Type": "application/json", "Accept": "application/json", "customer-id": "2698881212", "x-api-key": vectara_config["api-key"]}, data=json.dumps({"query": [{"query": text, "numResults": 5, "corpusKey": [{"customerId": 2698881212, "corpusId": corpus_id}]}]}))
    relevant_text = []
    for fragment in response.json()["responseSet"]["responseList"]:
        relevant_text.append(fragment["text"])
    return relevant_text

@app.route("/substitute")
async def substitute():
    file = (await request.files).pop("slideshow", None) # rest of the files, past the slideshow, will be google classroom documents
    temporary_document = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    file.save(temporary_document.name)
    temporary_document.close()

    job = cloudconvert.Job.create(payload={
        "tasks": {
            "upload-my-file": {
                "operation": "import/upload"
            },
            "convert-my-file": {
                "operation": "convert",
                "input": "upload-my-file",
                "output_format": "pdf"
            }
        }
    })
    cloudconvert.Task.upload(file_name=temporary_document.name, task=cloudconvert.Task.find(id=job["tasks"][0]["id"]))
    output = cloudconvert.Task.wait(id=job["tasks"][1]["id"])
    pdf_file = requests.get(output.get("result").get("files")[0]["url"]).content

    document = fitz.open(output.get("result").get("files")[0]["filename"], pdf_file)
    document_text = []
    document_images = []
    for page in document:
        page = Image.open(page.get_pixmap()) # allows text from images to also be extracted
        document_images.append(page)
        document_text.append(pytesseract.image_to_string(page).strip())

    if request.args["user_id"] not in list_corpus():
        create_corpus(request.args["user_id"])

    for file in (await request.files).values(): # rest of the files, past the slideshow, will be google classroom documents
        upload_file_to_corpus(request.args["user_id"], file)

    final_audio_files = []
    for page_text, page_image in zip(document_text, document_images):
        relevant_page_text = query_corpus(request.args["user_id"], page_text)
        image_buffer = io.BytesIO()
        page_image.save(image_buffer, format="JPEG")
        image_buffer.seek(0)

        relevant_page_text_combined = "\n".join(relevant_page_text)
        prompt = f"Page Text:\n{page_text}\nRelevant Assignment Documents (from google classroom):\n{relevant_page_text_combined}"
        system_message = "You are a slideshow speaker text creator. Based on the following slide text and slide image, generate a spoken lesson plan. Whatever you generate will be directly spoke to students. You will be given the slide page text, slide page image, and relevant other assigned documents from google classroom."
        response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4-vision-preview", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64.b64encode(image_buffer.read()).decode()}"}}]}], "max_tokens": 1500})

        audio = openai_client.audio.speech.create(model="tts-1", voice="echo", input=response.json().choices[0]).content
        audio_filename = str(uuid.uuid4()) + ".mp3"
        audio_files[audio_filename] = io.BytesIO(audio)
        final_audio_files.append("/downloads/" + audio_filename)

    return jsonify(final_audio_files)

@app.route("/download/<filename>")
def download_file(filename):
    return send_file(audio_files[filename], attachment_filename=filename, as_attachment=True, mimetype="audio/mp3")

app.run(host="localhost", port=8080)