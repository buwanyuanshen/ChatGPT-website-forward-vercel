from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def index():
    api_key = os.environ.get('API_KEY', '')
    api_url = os.environ.get('API_URL', '')
    data = {"apiKey": api_key, "api_url": api_url}
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
