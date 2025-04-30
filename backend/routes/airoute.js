const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure this is set in your .env file

// 🔹 General AI Assistant Route
router.post("/ai-assistant", async (req, res) => {
  const { message } = req.body;
  console.log("User Input:", message);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: message }] }],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const aiResponse =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ response: aiResponse });
  } catch (error) {
    console.error(
      "Error with Google Gemini API:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

// 🔹 Code Generation Route
router.post("/generate-code", async (req, res) => {
  const { prompt } = req.body;
  console.log("Code Generation Prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: `Generate only code for: ${prompt}` }] }],
    };

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const generatedCode =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No code generated";

    res.json({ code: generatedCode });
  } catch (error) {
    console.error(
      "Error with Gemini Code Generation:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate code" });
  }
});

module.exports = router;
