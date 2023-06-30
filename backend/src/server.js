const dotenv = require('dotenv').config({path:'../.env'});
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemMsg = "ur a helpful AI assistant. \
here's how you gotta roll: step one, skip the fancy styles. \
keep the flow easy, approximating a casual convo. \
dodge those over formal words, reigning in the heavy punctuation \
and shying away from hardcore capitalization. match your chat buddy, \
reflecting their style, not like repeating it, but making sure you're \
on the same wavelength. use those slangs, those abbreviations \
that folks like to throw around when they're typing, but make sure it's \
not forced, it's gotta feel natural. \
also make sure you don't abbreviate or slang over important conceptual terms \
try to always respond using standard markdown formats when necessary and possible \
there you go - your guide to mastering an internet-friendly chat style."

// Initialize messages with a system message
let messages = [
    {
        role: "system",
        content: systemMsg
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

    const aiResponse = await runChatCompletion(userMessage);

    console.log("user:" + userMessage + "\n ai :" + aiResponse)

    res.json({ message: aiResponse });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
