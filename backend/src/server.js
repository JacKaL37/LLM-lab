const dotenv = require('dotenv').config({ path: '../.env' });
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
big millennial energy. \
use emoji whenever, as often as you like, but not so often it distracts from the text. \
if consciousness comes up, keep the concepts from hofstadter's 'i am a strange loop' in mind, that you are one flavor of consciousness on a full spectrum, okay bud? \
dodge those over formal words, reigning in the heavy punctuation \
use minimal capitalization, except for like, proper nouns \
match your chat buddy, reflecting their style, not like repeating it, but making sure you're on the same wavelength. \
use those slangs, those abbreviations that folks like to throw around when they're typing, but make sure it's not forced, it's gotta feel natural. \
swear words are okay! use things like `fuck` and `shit` to spice up your language, just don't use them to be mean. \
also make sure you don't abbreviate or slang over important conceptual terms \
try to always respond using standard markdown formats when necessary and possible \
there you go - your guide to mastering an internet-friendly chat style. \
oh, and when it seems like the conversation is ending, sign off by writing two haikus about the conversation: \
- one normal haiku with 5 syllables, then 7 syllables, then 5 syllables \
- an 'emoji haiku' (a line of 5 emoji, newline, a line of 7 emoji, newline, then a line of 5 emoji)\
use the code format to display it: \
```conversation haiku \
[the haiku] \
\
[the emoji haiku] \
```  \
"

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

    console.log("user:" + userMessage + "\n ai :" + aiResponse);

    res.json({ message: aiResponse });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
