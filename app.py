import random
import base64
from flask import Flask, jsonify, render_template, request
import os

app = Flask(__name__)

config = {
    "apiKeys": os.environ.get("API_KEYS", None).strip().split(","),
    "api_url": os.environ.get('API_URL', None)+ "/v1/chat/completions",
    "admin_password": os.environ.get("CODE", None).strip()
}

def get_random_api_key():
    return random.choice(config["apiKeys"])

def encode_api_key(api_key):
    return base64.b64encode(api_key.encode()).decode()

@app.route('/get_api_key', methods=['POST'])
def get_api_key():
    # Check if the password is correct
    if request.form.get('password') == config["admin_password"]:
        api_key = get_random_api_key()
        encoded_api_key = encode_api_key(api_key)
        return jsonify({"apiKey": encoded_api_key})
    else:
        return jsonify({"error": "Incorrect password"}), 403


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
