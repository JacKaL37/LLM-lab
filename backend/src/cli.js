const readline = require('readline');
const dotenv = require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'user > ',
    terminal: false
});

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

    console.log(`ai > ${chatCompletion.data.choices[0].message.content}`);
    //console.log(messages)
    rl.prompt();
}

// Event listener for line input
rl.on('line', async (input) => {
    await runChatCompletion(input);
});

// Event listener for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    process.exit();
});

console.log('Type something (Press Ctrl+C to exit):');
rl.prompt();
