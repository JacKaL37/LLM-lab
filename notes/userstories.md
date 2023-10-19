

Student's first exposure:

- Student goes to web page that I host
- "Logs in" with their student ID
- engages in a conversation of variable length
- "submit" assignment somehow
  - server logs the conversation somewhere (also langsmith)
  - tell me you're done, and I check the server logs folder
  - copy button, paste into brightspace
- uses localstorage / sessionstorage (and a "memory clear" button) for persistence

hardcoded: 
- context of the topic
- student ID list



config stuff:
- user_id, content
- static system prompt
- file logging output
- model type
- other config




New endpoint: stateless
- full_conversation as input
  - conversation history is immediately shredded by TokenBufferMemory (set to half of max tokens? depends on system prompt size)
- system_prompt: included in the json payload
- user_id / other metadata (especially for langsmith)
+ config
? saving output works directly rn (should, check the logger utility)


STRETCH GOAL / STOPPING POINT:
- get token color cycling going, hahahah. 
- all tokens now components bound to spans. 



schema: 

payload = {
    "model": "gpt-4",
    "temperature": 0.7,
    "system_prompts": [
        "Personality: big millennial energy, minimal punctuation and capitalization, vibey, emojis and swearing are allowed",
        "Task: chat with the user about their own interests, and help relate their interests to the course concepts below",
        "Concepts: [lecture notes about computational modeling of cognitive processes]"
    ],
    "uid": "812345679",
    "context_route": ["COG366","M01","812345679"],
    "conversation": [
        { "role": "user", "content": "Hello, you're a cool guy." },
        { "role": "ai", "content": "Aw, thanks!" },
        { "role": "user", "content": "I'm really interested in cognitive science." },
        { "role": "ai", "content": "That's great! I can help you with that." },
        { "role": "user", "content": "What is computational modeling?" },
        { "role": "ai", "content": "Computational modeling is a way to simulate cognitive processes using computer programs." },
        { "role": "user", "content": "How does it work?" },
        { "role": "ai", "content": "It works by creating a computer program that simulates the cognitive process you're interested in." },
        { "role": "user", "content": "That's cool!" },
        { "role": "ai", "content": "I'm glad you think so!" },
        { "role": "user", "content": "I'm going to go now." },
        { "role": "ai", "content": "Goodbye!"}
    ]
}
