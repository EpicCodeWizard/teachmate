from pytesseract import pytesseract
from dotenv import dotenv_values
from openai import OpenAI
from mtcnn import MTCNN
from PIL import Image
from quart import *
import cloudconvert
import requests
import tempfile
import base64
import json
import fitz
import uuid
import cv2
import os
import io

app = Quart(__name__)
vectara_config = dotenv_values(".vectara.env")
cloudconvert_config = dotenv_values(".cloudconvert.env")
openai_config = dotenv_values(".openai.env")

cloudconvert.configure(api_key=cloudconvert_config["api-key"])
detector = MTCNN()
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

def convert_to_pdf(filename):
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
    cloudconvert.Task.upload(file_name=filename, task=cloudconvert.Task.find(id=job["tasks"][0]["id"]))
    output = cloudconvert.Task.wait(id=job["tasks"][1]["id"])
    return output.get("result").get("files")[0]["filename"], requests.get(output.get("result").get("files")[0]["url"]).content

@app.route("/substitute")
async def substitute():
    file = (await request.files).pop("slideshow") # rest of the files, past the slideshow, will be google classroom documents
    temporary_document = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    file.save(temporary_document.name)
    temporary_document.close()

    pdf_filename, pdf_file = convert_to_pdf(temporary_document.name)
    document = fitz.open(pdf_filename, pdf_file)
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

    final_slideshow_files = {}
    for page_text, page_image in zip(document_text, document_images):
        relevant_page_text = query_corpus(request.args["user_id"], page_text)
        image_buffer = io.BytesIO()
        page_image.save(image_buffer, format="JPEG")
        image_buffer.seek(0)
        page_image_url = f"data:image/jpeg;base64,{base64.b64encode(image_buffer.read()).decode()}"

        relevant_page_text_combined = "\n".join(relevant_page_text)
        prompt = f"Page Text:\n{page_text}\n\n\n\nRelevant Assignment Documents (from google classroom):\n{relevant_page_text_combined}"
        system_message = "You are a slideshow speaker text creator. Based on the following slide text and slide image, generate a spoken lesson plan. Whatever you generate will be directly spoke to students. You will be given the slide page text, slide page image, and relevant other assigned documents from google classroom."
        response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4-vision-preview", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, {"type": "image_url", "image_url": {"url": page_image_url}}]}], "max_tokens": 1500})

        audio = openai_client.audio.speech.create(model="tts-1", voice="echo", input=response.json().choices[0]).content
        audio_filename = str(uuid.uuid4()) + ".mp3"
        audio_files[audio_filename] = io.BytesIO(audio)
        final_slideshow_files[page_image_url] = "/downloads/" + audio_filename

    return jsonify(final_slideshow_files)

@app.route("/attendance")
async def attendance():
    seating_chart = fitz.open((await request.files)["attendance"].filename, (await request.files)["attendance"].read())
    text_bbox_dict = {}
    for page in seating_chart:
        text_dict = page.get_text("dict")
        for block in text_dict["blocks"]:
            for line in block["lines"]:
                for span in line["spans"]:
                    text_bbox_dict[span["text"].strip()] = list(span["bbox"])

    new_bboxes = []
    rgb_attendance_photo = cv2.cvtColor(cv2.imread((await request.files)["attendance"]), cv2.COLOR_BGR2RGB)
    for face in detector.detect_faces(rgb_attendance_photo):
        bbox = face["box"]
        bbox[2] += bbox[0]
        bbox[3] += bbox[1]
        new_bboxes.append(bbox)

    closest_texts = {}
    for new_bbox in new_bboxes:
        closest_text = None
        min_distance = float("inf")
        for text, bbox in text_bbox_dict.items():
            center1 = ((new_bbox[0] + new_bbox[2]) / 2, (new_bbox[1] + new_bbox[3]) / 2)
            center2 = ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)
            distance = ((center1[0] - center2[0]) ** 2 + (center1[1] - center2[1]) ** 2) ** 0.5
            if distance < min_distance:
                min_distance = distance
                closest_text = text
        closest_texts[closest_text] = new_bbox

    return jsonify({"present": list(closest_texts.keys()), "absent": list(set(text_bbox_dict.keys()) - set(closest_texts.keys()))})

@app.route("/lesson_plan")
async def lesson_plan():
    file = (await request.files).pop("slideshow")
    temporary_document = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    file.save(temporary_document.name)
    temporary_document.close()

    pdf_filename, pdf_file = convert_to_pdf(temporary_document.name)
    document = fitz.open(pdf_filename, pdf_file)
    document_text = []
    document_images = []
    for page in document:
        page = Image.open(page.get_pixmap()) # allows text from images to also be extracted
        document_images.append(page)
        document_text.append(pytesseract.image_to_string(page).strip())

    if request.args["user_id"] not in list_corpus():
        create_corpus(request.args["user_id"])

    final_information = {}
    document_text_combined = "\n".join(document_text)
    relevant_page_text = query_corpus(request.args["user_id"], document_text_combined)
    prompt = f"Slide Text:\n{document_text_combined}\n\n\n\nOther Relevant Documents:{relevant_page_text}"

    system_message = "You are a slideshow learning objectives creator. Based on the following slide text and other relevant documents, generate 7-8 specific learning objectives. Whatever you generate will be directly given to students."
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, ]}], "max_tokens": 1500})
    final_information["learning_objectives"] = response.json().choices[0]

    system_message = "You are a slideshow starter creator. Based on the following slide text and other relevant documents, generate 2-3 specific questions that can lead to the slideshow. These will be discussion questions - whatever you generate will be directly said to students."
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, ]}], "max_tokens": 1500})
    final_information["initial_questions"] = response.json().choices[0]

    system_message = "You are a slideshow questions creator. Based on the following slide text and other relevant documents, generate 9-10 specific questions that can be asked throughout the slides for comprehension. Whatever you generate will be directly placed into the slides."
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, ]}], "max_tokens": 1500})
    final_information["questions"] = response.json().choices[0]

    return jsonify(final_information)

@app.route("/feedback")
async def feedback():
    file = (await request.files).pop("slideshow")
    temporary_document = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    file.save(temporary_document.name)
    temporary_document.close()

    pdf_filename, pdf_file = convert_to_pdf(temporary_document.name)
    document = fitz.open(pdf_filename, pdf_file)
    document_text = []
    document_images = []
    for page in document:
        page = Image.open(page.get_pixmap()) # allows text from images to also be extracted
        document_images.append(page)
        document_text.append(pytesseract.image_to_string(page).strip())

    if request.args["user_id"] not in list_corpus():
        create_corpus(request.args["user_id"])

    final_information = {}
    document_text_combined = "\n".join(document_text)
    relevant_page_text = query_corpus(request.args["user_id"], document_text_combined)
    feedback = request.args["feedback"].strip()
    prompt = f"Initial Feedback:\n{feedback}\n\n\n\nDocument Text:\n{document_text_combined}\n\n\n\nOther Relevant Documents:{relevant_page_text}"
    system_message = "You are a feedback bot. Based on the following document text and other relevant documents, generate specific feedback. It should be highly specific and provide a lot of constructive criticism. It should also reference parts of the document/essay specifically. Whatever you generate will be directly given to students. Some initial feedback has been given as a starting point."
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, ]}], "max_tokens": 1500})
    final_information["feedback"] = response.json().choices[0]

    return jsonify(final_information)

@app.route("/generate_curriculum")
async def generate_curriculum():
    query = request.args["topic"].strip()
    lesson_time = request.args["lesson_time"].strip()

    final_information = {}
    relevant_page_text = query_corpus(request.args["user_id"], query)
    prompt = f"Topic:\n{query}\n\n\n\nOther Relevant Documents:{relevant_page_text}"
    system_message = f"You are a lesson generator bot. Based on college learning objectives and guidelines, you are to generate a detailed {lesson_time} minute lesson plan. Whatever you generate will be directly used as teaching material for teachers."
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}]}], "max_tokens": 1500})
    final_information["curriculum"] = response.json().choices[0]

    return jsonify(final_information)

@app.route("/grade")
async def grade():
    file = (await request.files).pop("document")
    temporary_document = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1])
    file.save(temporary_document.name)
    temporary_document.close()

    pdf_filename, pdf_file = convert_to_pdf(temporary_document.name)
    document = fitz.open(pdf_filename, pdf_file)
    document_text = []
    document_images = []
    for page in document:
        page = Image.open(page.get_pixmap()) # allows text from images to also be extracted
        document_images.append(page)
        document_text.append(pytesseract.image_to_string(page).strip())

    if request.args["user_id"] not in list_corpus():
        create_corpus(request.args["user_id"])

    final_information = {}
    document_text_combined = "\n".join(document_text)
    relevant_page_text = query_corpus(request.args["user_id"], document_text_combined)
    prompt = f"Document Text:\n{document_text_combined}\n\n\n\nOther Relevant Documents:{relevant_page_text}"
    system_message = "You are a grader bot. Based on the following document text and other relevant documents, generate a grade with general feedback. It should be specific to the assignment at hand and use context from other relevant documents. Whatever you generate will be directly given to students. The first line of your response should be a letter grade with a percent. Then, the rest lines of your response should contain feedback"
    response = requests.post("https://api.openai.com/v1/chat/completions", headers={"Content-Type": "application/json", "Authorization": f"Bearer {openai_api_key}"}, json={"model": "gpt-4", "messages": [{"role": "system", "content": [{"type": "text", "text": system_message}]}, {"role": "user", "content": [{"type": "text", "text": prompt}, ]}], "max_tokens": 1500})
    grade, feedback = response.json().choices[0].split("\n")[0], "\n".join(response.json().choices[0].split("\n")[1:])
    final_information["grade"] = grade
    final_information["feedback"] = feedback

    return jsonify(final_information)

@app.route("/download/<filename>")
def download_file(filename):
    return send_file(audio_files[filename], attachment_filename=filename, as_attachment=True, mimetype="audio/mp3")

app.run(host="localhost", port=8080)