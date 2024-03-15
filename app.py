from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    

    # 渲染模板时将 apiKey 和 api_url 传递给前端
    return render_template('index.html')

if __name__ == '__main__':
    app.run()