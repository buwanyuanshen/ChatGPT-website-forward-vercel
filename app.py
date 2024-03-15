from flask import Flask, render_template
import os
app = Flask(__name__)

@app.route('/')
def index():
    # 从环境变量中获取 apiKey 和 api_url
    api_key = os.environ.get('API_KEY', '')
    api_url = os.environ.get('API_URL', '')

    # 渲染模板时将 apiKey 和 api_url 传递给前端
    return render_template('index.html', api_key=api_key, api_url=api_url)

if __name__ == '__main__':
    app.run(debug=True)