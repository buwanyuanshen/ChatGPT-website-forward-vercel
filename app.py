from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    api_key = os.environ.get('API_KEY', '')
    api_url = os.environ.get('API_URL', '')
    return render_template('index.html', api_key=api_key, api_url=api_url)