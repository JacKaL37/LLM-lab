// solution using https found at: https://github.com/openai/openai-node/issues/18#issuecomment-1600019051

// solution is also broke.

const readline = require('readline');
const dotenv = require('dotenv').config();
const https = require('https');

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

async function* chunksToLines(chunksAsync) {
  let previous = '';
  console.log(previous)

  for await (const chunk of chunksAsync) {
    previous += chunk;

    let eolIndex;

    while ((eolIndex = previous.indexOf('\n')) >= 0) {
      const line = previous.slice(0, eolIndex + 1).trimEnd();

      if (line === 'data: [DONE]')
        break;

      if (line.startsWith('data: '))
        yield line.slice('data: '.length);

      previous = previous.slice(eolIndex + 1);
    }
  }
}

async function runChatCompletion(userMessage) {
  // Add user message to the messages
  messages.push({
    role: "user",
    content: userMessage
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/engines/davinci-codex/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, async res => {
    for await (const message of chunksToLines(res)) {
      try {
        const parsed = JSON.parse(message);
        const text = parsed.choices[0].text;
        messages.push({
          role: "assistant",
          content: text
        });
        console.log(`ai > ${text}`);
        rl.prompt();
      } catch (error) {
        console.error('Could not JSON parse stream message', message, error);
      }
    }
  });

  req.on('error', error => {
    console.error(error);
  });

  req.write(JSON.stringify({
    model: "gpt-4",
    messages: messages,
    stream: true
  }));
  
  req.end();
}

// Event listener for line input
rl.on('line', (input) => {
  runChatCompletion(input);
});

// Event listener for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  process.exit();
});

console.log('Type something (Press Ctrl+C to exit):');
rl.prompt();
