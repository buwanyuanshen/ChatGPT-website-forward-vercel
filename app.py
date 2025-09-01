from datetime import datetime, timedelta
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
    try:
        # Safely retrieve and parse the API_KEYS environment variable
        api_keys_str = os.environ.get("API_KEYS")
        if not api_keys_str:
            return jsonify({"error": {"message": "API_KEYS environment variable not set", "type": "config_error", "code": ""}}), 500

        apiKeys = [key.strip() for key in api_keys_str.split(',') if key.strip()]
        if not apiKeys:
            return jsonify({"error": {"message": "No API keys found in API_KEYS environment variable", "type": "config_error", "code": ""}}), 500

        apiKey = random.choice(apiKeys)
        apiUrl = os.environ.get("API_URL", None)

        # If the default apiKey or apiUrl is empty, return an error message
        if not apiKey or not apiUrl:
            return jsonify({"error": {"message": "No default API key or URL set", "type": "config_error", "code": ""}}), 500

        headers = {
            "Authorization": f"Bearer {apiKey}",
            "Content-Type": "application/json"
        }

        # Get balance information
        subscription_url = f"{apiUrl}/v1/dashboard/billing/subscription"
        subscription_resp = requests.get(subscription_url, headers=headers)
        subscription_resp.raise_for_status()  # Raise an exception for bad status codes
        subscription_data = subscription_resp.json()

        total = subscription_data.get('hard_limit_usd', 0)

        # Get usage information
        start_date = datetime.now() - timedelta(days=99)
        end_date = datetime.now()

        usage_url = f"{apiUrl}/v1/dashboard/billing/usage?start_date={start_date.strftime('%Y-%m-%d')}&end_date={end_date.strftime('%Y-%m-%d')}"
        usage_resp = requests.get(usage_url, headers=headers)
        usage_resp.raise_for_status()  # Raise an exception for bad status codes
        usage_data = usage_resp.json()

        total_usage = usage_data.get('total_usage', 0) / 100

        remaining = total - total_usage

        return jsonify({
            "total_balance": total,
            "used_balance": total_usage,
            "remaining_balance": remaining
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": {"message": f"API request error: {e}", "type": "api_error", "code": ""}}), 500
    except Exception as e:
        return jsonify({"error": {"message": str(e), "type": "api_error", "code": ""}}), 500

# Safely initialize the config dictionary
api_keys_from_env = os.environ.get("API_KEYS", "")
config = {
    "apiKeys": [key.strip() for key in api_keys_from_env.split(',') if key.strip()],
    "api_url": os.environ.get('API_URL', None),
    "admin_password": os.environ.get("CODE", "").strip()
}

def get_random_api_key():
    if not config["apiKeys"]:
        return None
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
        if api_key:
            encoded_api_key = encode_api_key(api_key)
            return jsonify({"apiKey": encoded_api_key})
        else:
            return jsonify({"error": "No API keys configured on the server"}), 500
    else:
        return jsonify({"error": "Incorrect password"}), 403

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
