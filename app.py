from flask import Flask, render_template,jsonify
import os

app = Flask(__name__)


# 设置环境变量
app.config['API_KEY'] = os.environ.get('API_KEY', '')
app.config['API_URL'] = os.environ.get('API_URL', '')

@app.route('/config')
def get_config():
    return jsonify({
        'apiKey': app.config['API_KEY'],
        'apiUrl': app.config['API_URL']
    }

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()