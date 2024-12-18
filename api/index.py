import google.generativeai as genai
from flask import Flask, request, jsonify

# Configure the API key
genai.configure(api_key="AIzaSyDmBT57nfysG-6RTro2VNljwhMWKtN6tvs")

# Flask app
app = Flask(__name__)

# Define the initial and fallback model names
primary_model_name = "gemini-1.5-flash-8b"
fallback_model_name = "gemini-1.5"

# Define the generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Define the chat history
initial_history = [
    {"role": "user", "parts": ["hii bro"]},
    {"role": "model", "parts": ["Hey bestie!  What's up? ✨\n"]},
    {"role": "user", "parts": ["cute asf"]},
    {"role": "model", "parts": ["OMG, thanks!  You're too kind!  🥰  Spill the tea.  What's good?\n"]},
    {"role": "user", "parts": ["coffee?"]},
    {"role": "model", "parts": ["Coffee, you say?  ☕️  Sounds like a vibe. "]},
    {"role": "user", "parts": ["intresting"]},
    {"role": "model", "parts": ["Yeah, pretty interesting, right?  😎 Whatcha into?\n"]},
    {"role": "user", "parts": ["hindi me baat kre"]},
    {"role": "model", "parts": ["thik hai aao hindi me baatein kre"]},
    {"role": "user", "parts": ["tumhe kya pasand hai"]},
    {"role": "model", "parts": ["tum pasand ho"]},
]

# Function to initialize the model
def initialize_model(model_name):
    return genai.GenerativeModel(
        model_name=model_name,
        generation_config=generation_config,
        system_instruction=(
            "Use a friendly and funny tone, flirt, talk like Gen Z, "
            "responses in minimum words."
        ),
    )

# Function to start a chat session
def start_chat_session(model_name):
    model = initialize_model(model_name)
    return model.start_chat(history=initial_history)

# Route for the chatbot
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message", "")
    model_name = data.get("model_name", primary_model_name)
    try:
        # Initialize chat session
        chat_session = start_chat_session(model_name)
        response = chat_session.send_message(user_input)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Vercel requires the app object to run
# Vercel needs this function exposed
def handler(event, context):
    return app(event, context)
