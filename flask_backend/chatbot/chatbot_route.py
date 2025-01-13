from flask import Flask, render_template, request, jsonify, Blueprint
from flask_cors import CORS, cross_origin
from .chat import get_response
import nltk

# Download 'punkt' at app startup if not already downloaded
nltk.download('punkt', quiet=True)

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route("/predict", methods=["POST"])
@cross_origin(supports_credentials=True)  # Enable CORS for this route
def predict():
    text = request.get_json().get('message')
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)
