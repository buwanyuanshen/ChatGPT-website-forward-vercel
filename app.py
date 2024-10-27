from datetime import datetime,timedelta 
from flask import Flask, request, jsonify, render_template, Response
import requests
import json
import os
import random
import base64
import re

app = Flask(__name__)
@app.route("/default_balance", methods=["GET"])
def get_default_balance():
    # 从配置文件中获取默认的 API_KEY 和 API_URL
    apiKey = os.environ.get("API_KEYS", None).strip().split(",")
    apiUrl = os.environ.get('API_URL', None)

    # 如果默认的 apiKey 或 apiUrl 为空，返回错误信息
    if not apiKey or not apiUrl:
        return jsonify({"error": {"message": "No default API key or URL set", "type": "config_error", "code": ""}})

    headers = {
        "Authorization": f"Bearer {apiKey}",
        "Content-Type": "application/json"
    }

    # 获取余额信息
    try:
        subscription_url = f"{apiUrl}/v1/dashboard/billing/subscription"
        subscription_resp = requests.get(subscription_url, headers=headers)
        subscription_data = subscription_resp.json()

        total = subscription_data.get('hard_limit_usd', 0)

        # 获取使用情况
        start_date = datetime.now() - timedelta(days=99)
        end_date = datetime.now()

        usage_url = f"{apiUrl}/v1/dashboard/billing/usage?start_date={start_date.strftime('%Y-%m-%d')}&end_date={end_date.strftime('%Y-%m-%d')}"
        usage_resp = requests.get(usage_url, headers=headers)
        usage_data = usage_resp.json()

        total_usage = usage_data.get('total_usage', 0) / 100

        remaining = total - total_usage

        return jsonify({
            "total_balance": total,
            "used_balance": total_usage,
            "remaining_balance": remaining
        })
    except Exception as e:
        return jsonify({"error": {"message": str(e), "type": "api_error", "code": ""}})

config = {
    "apiKeys": os.environ.get("API_KEYS", None).strip().split(","),
    "api_url": os.environ.get('API_URL', None),
    "admin_password": os.environ.get("CODE", None).strip()
}

def get_random_api_key():
    return random.choice(config["apiKeys"])

def encode_api_key(api_key):
    return base64.b64encode(api_key.encode()).decode()

@app.route('/config')
def get_config():
    # In a real scenario, ensure you have proper security measures to protect sensitive information
    return jsonify({"api_url": config["api_url"]})

@app.route('/get_api_key', methods=['POST'])
def get_api_key():
    # Check if the password is correct
    if request.form.get('password') == config["admin_password"]:
        api_key = get_random_api_key()
        encoded_api_key = encode_api_key(api_key)
        return jsonify({"apiKey": encoded_api_key})
    else:
        return jsonify({"error": "Incorrect password"}), 403



@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run('0.0.0.0', 80)
