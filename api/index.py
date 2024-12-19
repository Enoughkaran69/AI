import json
import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyDmBT57nfysG-6RTro2VNljwhMWKtN6tvs")

# Define the generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

def handler(request):
    user_input = request.get_json().get("message")
    if not user_input:
        return {"status": "error", "message": "No input provided"}, 400

    # Initialize the model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash-8b",
        generation_config=generation_config,
        system_instruction=(
            "Use a friendly and funny tone, flirt, talk like Gen Z, "
            "responses in minimum words."
        ),
    )

    # Generate a response
    response = model.start_chat(history=[{"role": "user", "parts": [user_input]}])
    return {"response": response.text}, 200
