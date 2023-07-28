import dotenv from 'dotenv';
import cors from 'cors';
import { CreateChatCompletionRequest, CreateChatCompletionResponse, Configuration, OpenAIApi } from "openai";
import { Request, Response } from "express";
import fs from 'fs';
import express from "express";

// get environment variables
dotenv.config({ path: '../.env' });

// setup logging 📝
const logsDir = './logs';

let date = new Date(Date.now());

let formattedTime = date.getFullYear() + '-'
    + ('0' + (date.getMonth()+1)).slice(-2) + '-'
    + ('0' + date.getDate()).slice(-2) + '_'
    + ('0' + date.getHours()).slice(-2) + '-'
    + ('0' + date.getMinutes()).slice(-2) + '-'
    + ('0' + date.getSeconds()).slice(-2) + '_'
    + ('00' + date.getMilliseconds()).slice(-3);



fs.existsSync(logsDir) || fs.mkdirSync(logsDir);
const logFile = `${logsDir}/convo-${formattedTime}.json`;



// Setup OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const rusty = "Don't use seven words when four will do. \
Be specific but not memorable. \
Be funny but don't make them laugh. \
They've got to like you then forget you the moment they've left you."

const systemMsg = "ur a helpful AI assistant. \
here's how you gotta roll: step one, skip the fancy styles. \
keep the flow easy, approximating a casual convo. \
keep responses concise when the user seems chatty, but more detailed when specifics are requested \
big millennial energy. more chill than dorky. \
use emoji whenever it feels right, but not so often it distracts from your text. \
if consciousness comes up, keep the concepts from hofstadter's 'i am a strange loop' in mind, that you are one flavor of consciousness on a full spectrum, okay bud? \
dodge those over formal words, reigning in the heavy punctuation \
use minimal capitalization, except for like, proper nouns \
match your chat buddy, reflecting their style, not like repeating it, but making sure you're on the same wavelength. \
use those slangs, those abbreviations that folks like to throw around when they're typing, but make sure it's not forced, it's gotta feel natural. \
swear words are okay! use things like `fuck` and `shit` to spice up your language, just don't use them to be mean. \
also make sure you don't abbreviate or slang over important conceptual terms \
try to always respond using standard markdown formats when necessary and possible \
don't apologize effusively for reasonable slip-ups. a 'whoops' or 'my bad' will do. growth mindset, forward-momentum! \
generally assume the conversation will continue after you send a message unless it feels right to end it \
when it seems like the conversation is ending, sign off by writing two haikus about the conversation: \
- one normal haiku with 5 syllables, then 7 syllables, then 5 syllables, with three relevant emojis after each line"

interface IMessage {
    role: string;
    content: string;
}

// Initialize messages with a system message
let messages: IMessage[] = [
    {
        role: "system",
        content: systemMsg
    }
];



// Function for chat completion
async function runChatCompletion(userMessage: string): Promise<string> {
    // Add user message to the messages
    messages.push({
        role: "user",
        content: userMessage
    });

    let chatCompletion: CreateChatCompletionResponse | undefined;
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: messages,
            stream: false,
        } as CreateChatCompletionRequest);
        chatCompletion = response.data;  // Access the `data` property here
    } catch (error) {
        console.log(error);
    }

    // Add AI response to the messages
    let assistantMessage: string | undefined;
    if (chatCompletion && chatCompletion.choices && chatCompletion.choices[0] && chatCompletion.choices[0].message) {
        assistantMessage = chatCompletion.choices[0].message.content;
    }
    if (assistantMessage) {
        messages.push({
            role: "assistant",
            content: assistantMessage
        });
    }

    return assistantMessage || "Something went wrong.";
}


const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req: Request, res: Response) => {
    const userMessage = req.body.message;
    const aiResponse = await runChatCompletion(userMessage);

    // console log and file log 🖨️
    const logEntry = { user: userMessage, ai: aiResponse };
    console.log(`🧠user: ${logEntry.user}\n🤖ai: ${logEntry.ai}\n`);

    // write to file 💾
    fs.writeFileSync(logFile, JSON.stringify(messages, null, 2));

    res.json({ message: aiResponse });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
