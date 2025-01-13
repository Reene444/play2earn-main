from flask import Flask
from flask_cors import CORS
import os
import requests
from chatbot.chatbot_route import chatbot_bp
from search_and_capture.app import search_capture_bp

app = Flask(__name__)
CORS(app, supports_credentials=True)
 # This will allow all routes to handle CORS


# Register blueprints
app.register_blueprint(chatbot_bp, url_prefix='/chatbot')
app.register_blueprint(search_capture_bp, url_prefix='/search_capture')

if __name__ == '__main__':
    app.run(debug=True)