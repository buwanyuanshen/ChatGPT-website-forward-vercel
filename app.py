from flask import Flask, render_template
from flask import render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    api_key = os.environ.get('API_KEY', None)
    api_url = os.environ.get('API_URL', None)
    return render_template('index.html', api_key=api_key, api_url=api_url)



if __name__ == '__main__':
    app.run('0.0.0.0', 80)
