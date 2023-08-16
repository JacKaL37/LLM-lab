time to make the tree thing
- use composition api, dawg. (thanks claaaaude)
- consider pidia for state management
  - little fuckery there if you wanna use scoped states for a super-app
  - simple pimple first, use global state, because---
- refocus on the single conversation agent experience
- get langsmith going
  - api fuckery
  - but this will be perfect for student sessions (FREE DATA COLLECTION!!)
  
- try to finish retrieving some sort of yahoo.json 
  - implement a vectorstore 
  - at end of conversation, spit out most relevant yahoo answer thread. 

- funsies:
  - more audio messing about
  - animating portions of tokens when certain things occur (like grabbing the last words before a ! and having them shake and grow)
- backend: add logging for tokens by timestamp (mission critical)
- backend: refactor into distinct scripts / objects / etc
- frontend: mess with <audio> tag
  - further: make custom component
- frontend: refactor into more components:
  - Components: ConvoBox, ConvoMessage, CodeBox, ToneBox (could be composable, better as a full component)
  - Composables: WebSocketComposable, AxiosPostComposable, MarkdownParserComposable
- fixes:
  - audio fails to restart properly in ios
- new features:
  - llm swapping
  - conversation tree
    - ? incorporating LLM swapping in the tree. has potential! but may be logistically impossible.
  - document loader
  - persistent memory somehow: local storage, or database? both viable. 
  - download conversation histories (or even just copy)
  - student conversation golemstrings:
    - conversation duration steering advice: "when the conversation is at about 1000 words, start wrapping it up, thanking them for their time, then wrap up the conversation with the haiku"
    - paper contents (vectorstore? or just in context?), 
    - open-ended prompt for the whole conversation-- e.g., my "Final Thought" journal prompts
    - student interest profiles, potentially! 
  - IDs / login / identity management
  