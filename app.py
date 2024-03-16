import os
import random
from flask import Flask, render_template, jsonify

app = Flask(__name__)

api_keys = os.environ.get("API_KEYS", None).strip().replace('"', '').replace("'", "").split(",|")

# 设置默认配置
config = {
    "apiKey": random.choice(api_keys),
    "api_url": os.environ.get('API_URL', None)
}

@app.route('/config')
def get_config():
    return jsonify(config)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
