from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def index():
    apiKey = request.form.get("apiKey", None)
    api_url = request.form.get("api_url", None)
    if api_url is None:
        api_url = os.environ.get("API_URL", None)
    if apiKey is None:
    apiKey = os.environ.get("API_KEY", None)

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
