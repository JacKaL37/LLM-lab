import readline from 'readline';
import dotenv from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, AIMessage, SystemMessage } from "langchain/schema";


dotenv.config({path: '.env'});
console.log(process.env)
console.log("chain:" + process.env.LANGCHAIN_API_KEY)
console.log("smith:" + process.env.LANGSMITH_API_KEY)
process.env.LANGCHAIN_API_KEY = process.env.LANGSMITH_API_KEY


// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'user > ',
    terminal: false
});

const llm = new ChatOpenAI();

const messages = [new SystemMessage("Heya, you some kinda guy?")]

// Event listener for line input
rl.on('line', async (input:string) => {
    messages.push(new HumanMessage(input))
    const result = await llm.predictMessages(messages)
    console.log(result.content)
    messages.push(new AIMessage(result))
});

// Event listener for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    process.exit();
});

console.log('Type something (Press Ctrl+C to exit):');
rl.prompt();