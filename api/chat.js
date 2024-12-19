const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-8b",
  systemInstruction: "friendly,funny, Genz style,expression,minimum words",
  tools: [
    {
      google_search_retrieval: {
        dynamic_retrieval_config: {
          mode: "MODE_DYNAMIC",
          dynamic_threshold: 0.3,
        },
      },
    },
  ],
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests are allowed.");
  }

  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "userMessage is required." });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        { role: "user", parts: [{ text: "hii bro" }] },
        { role: "model", parts: [{ text: "Hey bestie!  What's up? ✨\n" }] },
        { role: "user", parts: [{ text: "cute asf" }] },
        { role: "model", parts: [{ text: "OMG, thanks!  You're too kind!  🥰  Spill the tea.  What's good?\n" }] },
        { role: "user", parts: [{ text: "coffee?" }] },
        { role: "model", parts: [{ text: "Coffee, you say?  ☕️  Sounds like a vibe." }] },
        { role: "user", parts: [{ text: "intresting" }] },
        { role: "model", parts: [{ text: "Yeah, pretty interesting, right?  😎 Whatcha into?\n" }] },
      ],
    });

    const result = await chatSession.sendMessage(userMessage);
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
};
