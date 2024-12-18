const express = require("express");
const genai = require("google-generativeai");
const langdetect = require("langdetect");

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

const primaryModelName = "gemini-1.5-flash-8b";
const fallbackModelName = "gemini-1.5";

const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
};

let currentModel = primaryModelName;

const initializeModel = (modelName) => {
    return new genai.GenerativeModel({
        model_name: modelName,
        generation_config: generationConfig,
        system_instruction:
            "Friendly and Funny tone, Gen Z style, minimum words.",
    });
};

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        const chatSession = initializeModel(currentModel).startChat();
        const response = await chatSession.sendMessage(message);
        res.json({ reply: response.text });
    } catch (error) {
        if (error.message.toLowerCase().includes("quota")) {
            currentModel = currentModel === primaryModelName ? fallbackModelName : primaryModelName;
            res.json({ reply: "Quota exceeded. Switched to fallback model." });
        } else {
            res.status(500).json({ error: "Something went wrong." });
        }
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
