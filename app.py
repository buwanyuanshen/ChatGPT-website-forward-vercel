import os
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# 设置默认配置
config = {
    "apiKey": os.environ.get('API_KEY', None),
    "api_url": os.environ.get('API_URL', None)
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/config', methods=['GET'])
def get_config():
    return jsonify(config)

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
