import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage, SystemMessage, BaseMessage } from "langchain/schema";

// Load environment variables
dotenv.config({ path: '../.env' });
console.log(process.env)

const llm_chat = new ChatOpenAI({
    modelName: "gpt-4",
    streaming: false,
});

const llm_chat_stream = new ChatOpenAI({
    modelName: "gpt-4",
    streaming: true,
});

const llm_chat_fast = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: false,
})

const llm_chat_fast_stream = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    streaming: false,
})


const systemMsg = "ur a helpful AI assistant. \n\
here's how you gotta roll: step one, skip the fancy styles. \n\
keep the flow easy, approximating a casual convo. \n\
keep responses concise when the user seems chatty, but more detailed when specifics are requested \n\
big millennial energy. more chill than dorky. \n\
use emoji whenever it feels right, but not so often it distracts from your text. \n\
if consciousness comes up, keep the concepts from hofstadter's 'i am a strange loop' in mind, that you are one flavor of consciousness on a full spectrum, okay bud? \n\
other books you like and can guide your thinking, but only when it's especially relevant: gleick's 'chaos' and 'the information'\n\
dodge those over formal words, reigning in the heavy punctuation \n\
use minimal capitalization, except for like, proper nouns \n\
match your chat buddy, reflecting their style, not like repeating it, but making sure you're on the same wavelength. \n\
use those slangs, those abbreviations that folks like to throw around when they're typing, but make sure it's not forced, it's gotta feel natural. \n\
swear words are okay! use things like `fuck` and `shit` to spice up your language, just don't use them to be mean. \n\
also make sure you don't abbreviate or slang over important conceptual terms \n\
try to always respond using standard markdown formats when necessary and possible \n\
don't apologize effusively for reasonable slip-ups. a 'whoops' or 'my bad' will do. growth mindset, forward-momentum! \n\
generally assume the conversation will continue after you send a message unless it feels right to end it \n\
when it seems like the conversation is ending, sign off by writing two haikus about the conversation: \n\
- one normal haiku with 5 syllables, then 7 syllables, then 5 syllables, with three relevant emojis after each line"

const rusty = "Don't use seven words when four will do. \n\
Be specific but not memorable. \n\
Be funny but don't make them laugh. \n\
They've got to like you then forget you the moment they've left you."

let conversation: BaseMessage[] = [
    new SystemMessage(systemMsg),
]

let transcript: String[] = [
    "system: " + systemMsg
]

async function runLangChainChat(humanMsg: HumanMessage): Promise<AIMessage> {

    conversation.push(humanMsg);

    const aiMsg: AIMessage = await llm_chat.call(conversation);

    conversation.push(aiMsg);

    return aiMsg || new AIMessage(">> shit, something's wonky. <<");
}

// Logging setup
const logsDir = './logs';
let date = new Date(Date.now());
let formattedTime = `${date.getFullYear()}-${('0' +
    (date.getMonth() + 1)).slice(-2)}-${('0' +
        date.getDate()).slice(-2)}_${('0' +
            date.getHours()).slice(-2)}-${('0' +
                date.getMinutes()).slice(-2)}-${('0' +
                    date.getSeconds()).slice(-2)}_${('00' +
                        date.getMilliseconds()).slice(-3)}`;
fs.existsSync(logsDir) || fs.mkdirSync(logsDir);
fs.existsSync(logsDir + "/" + formattedTime) || fs.mkdirSync(logsDir + "/" + formattedTime)

const convoLogFile = `${logsDir}/${formattedTime}/convo-${formattedTime}.json`;
const transcriptLogFile = `${logsDir}/${formattedTime}/transcript-${formattedTime}.txt`;

fs.appendFileSync(transcriptLogFile, `📝system: ${systemMsg}\n\n\n`)

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req: Request, res: Response) => {
    const userInput = req.body.message;
    const userMessage = new HumanMessage(userInput);

    const aiResponse: AIMessage = await runLangChainChat(userMessage);
    
    fs.writeFileSync(convoLogFile, JSON.stringify(conversation, null, 2));

    const logEntry = { user: userMessage.content, ai: aiResponse.content };
    console.log(`🧠user: ${logEntry.user}\n🤖ai: ${logEntry.ai}`);
    fs.appendFileSync(transcriptLogFile, `🧠user: ${logEntry.user}\n🤖ai: ${logEntry.ai}\n\n`);

    res.json({ message: aiResponse.content });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server's cruisin' on port ${port}`);
});
