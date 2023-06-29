const dotenv = require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize messages with a system message
let messages = [
    {
        role: "system",
        content: "You are talking to GPT-4"
    }
];

// Function for chat completion
async function runChatCompletion(userMessage) {
    // Add user message to the messages
    messages.push({
        role: "user",
        content: userMessage
    });

    const chatCompletion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: messages,
        stream: false,
    });

    // Add AI response to the messages
    messages.push({
        role: "assistant",
        content: chatCompletion.data.choices[0].message.content
    });

    return chatCompletion.data.choices[0].message.content;
}

// Create Express app
const app = express();

// Use cors middleware (for local testing cross-origin errors)
app.use(cors())

// Middleware to parse JSON bodies from HTTP POST
app.use(express.json());

// Route handler for chat completion
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log("user:" + userMessage)
    const aiResponse = await runChatCompletion(userMessage);
    console.log(" ai :" + aiResponse)
    res.json({ message: aiResponse });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
