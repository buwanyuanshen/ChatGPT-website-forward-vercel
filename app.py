import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    # 从环境变量中读取 apiKey 和 api_url
    apiKey = os.environ.get('API_KEY', '')
    apiUrl = os.environ.get('API_URL', '')

    # 设置 data 字典
    data = {"apiKey": apiKey, "api_url": apiUrl}

    # 如果 apiKey 不为空，则将其存储到本地存储中
    if apiKey:
        # 存储到本地存储中（如果需要）
        # 例如：localStorage.setItem('apiKey', apiKey)
        pass

    # 如果 apiUrl 不为空，则将其存储到本地存储中
    if apiUrl:
        # 存储到本地存储中（如果需要）
        # 例如：localStorage.setItem('api_url', apiUrl)
        pass

    return jsonify(data)

if __name__ == '__main__':
    app.run()