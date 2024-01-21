from quart import Quart
import requests

url = "https://api.vectara.io/v1/upload"

payload={}
headers = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'x-api-key': '<API_KEY_VALUE>'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

app = Quart(__name__)

@app.route("/")
async def main():
    return "hi"

app.run(host="localhost", port=8080)