// Import the Express framework to create a router
import express from "express";

// Import the OpenAI SDK to interact with OpenAI's API
import OpenAI from "openai";

// Create a new Express router instance
const router = express.Router();

// Initialize the OpenAI client with your API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
});

// Define a POST route at /summarize to handle text summarization requests
router.post("/summarize", async (req, res) => {
  // Extract the 'prompt' from the request body
  const { prompt } = req.body;

  // If no prompt is provided, respond with a 400 Bad Request error
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    // Send the prompt to OpenAI's chat completion endpoint using the GPT-4.1 model
    const response = await openai.chat.completions.create({
      model: "gpt-4.1", // Specify the model version
      messages: [{ role: "user", content: prompt }], // Provide the user message
    });

    // Extract the generated content from the response
    const output = response.choices[0].message.content;

    // Send the generated output back to the client as JSON
    res.json({ output });
  } catch (error) {
    // Log any errors that occur during the API call
    console.error("OpenAI error:", error);

    // Respond with a 500 Internal Server Error if something goes wrong
    res.status(500).json({ error: "Failed to generate text." });
  }
});

// Export the router to be used in your main server file
export default router;
