todo

x install openai
x install dotenv

x install express
x get back-end server endpoint running


x install @vue/cli

x rename to llm-lab

x install cors

x create vue.js frontend
x abstract the chat component out to be used *everywhere*
- add message-history retrieval endpoint to backend (optional)

x implement copy button
- fix copy API denial by getting into SSL certification
xx lolol, nvm, found a shitty hacky way around it. (temporary!)

-- !!! offramp
  - get Demo Bot Garden rolling. 
  - requires: 
    - frontend selection screen
    - frontend example animation
    - prompt personality solidification
    - ingestion
    - backend streaming
    - frontend streaming
    - add "generator"
    - statelessness -- frontend data model
    - local storage usage
    - "new conversation" button
    - saving multiple conversations. ?

    - demo-bot generator prompt
    - demo bot script conversion prompt
    - conversion of helper prompts to current bot "voice"
    - keep demo-bots backstage in a file so we can save user entries to it

--------------------------------------
--------------------------------------
--------------------------------------
--------------------------------------
--------------------------------------
--------------------------------------


- model revisions
  - chat dictionary: uuid, time, user, etc-- query keys
  - content: message history, etc. 

- abstract out the codeblock component
  - add syntax hilighting

- streaming, how-do. (earlier is better, as it seems fundamental to the data flow pattern.)
- perplexity measurements
- token counts

- hyperparameter panel

- incorporate typesecript

- install langchainjs

- declare-lab
  - 13-billion

- component: prompt-viewer
  - decorated prompt

- tabs:
  - langflow
  - playground for databases / integrations / whatever goes into the prompt - 
  - 

- add bootstrap to the frontend

- figure out bootstrap + vue + typescript-- collisions?
  - will this stuff get fucky?



- endpoints: 
  x chat
  - zero-shot (critical for experiment patterns)
  - message-history
  - batch



- parameter panel component: 
  - temperature and n
  - "copy conversation to clipboard" -- may want to add an intervening data structure to track the conversation. this is good in general, in case we want to do some stuff with it, rather than have it all be excslusively baked in. But, this will require some reworking of the architecture. It may be in range, or it may be "version 2" stuff. 


- revise model/schema: 
  - "sub-apps" as in, major components, maintain their Complete State for all operations within. 
  - the super-app, the "lab-app", has its own super-state
  - sub-apps emit their states on request

- save/load conversation histories

- document loaders?

- save and load function for various parts of the app:
  - messages
  - full conversations
  - pop me up a download prompt / save downloads folder

- add copy button for: 
  - full messages
  - complete conversations
  - format toggle?: raw text, markdown, json, etc. 

- vueflow - https://vueflow.dev/
  - adding a panel for navigating a conversation tree (i.e., visualizing a chatML object) 


- examine D3 trees for navigating message history spaces
  - have a gpt-3 bot name each node with a single sentence



- port to google cloud instance
  - purchase it, too


- mongodb - handles the asynchronous calls
  - 

- localstorage
- full model state download

- make the server stateless

!!! front-end components can define ALL of their functionality
  - completely encapsulate the interaction definition!
  - 

?? langflow tab to configure the flow of an agent, 
  - save the agent there, and then have it automatically construct a new agent component definition
  - make it into a front-end compoennt
  - have the front-end components minimally functionally mapped to the agent involved
    - allowing users to customize is just as good (formative pedagogy!)
  - a component options tab? -- probably just in the lang flow tab
  - how might serialization expedite this?


- knowledge base
  - 

- new component
  - the components themselves can 
  - 




- two databases
  - context database
  - user database
  - 

? should the server be stateless?
  - API key needs to be back there
  - also, when databases and vectorstores become part of the equation
  - otherwise, keeps all the important stuff in the app's front-end
  - server serves as a router more than anything. 


- MVP 
  - standard paper digester agent
  - also an investigator script for the litany against fear

# Conversations

doping memory to bias the vectors
- "what is the current topic"
- "need to talk about ( )"
- add it into the vectorstore retrieval with a huge weight value on the topic's semantic vector
- tada, we can more reliably slip between domains
- can also look to the future of generating these weights automatically

Memory Structure
- user memory
  - each user will have an id
  - memory of entities
  - memory of knowledge
  - maybe on a decaying vectorstore?
- conversation memory
  - each conversation will have an id
  - conversation buffer
  - summary
  - a message vectorstore
    - retrieves the N most relevant messages from history based on M most recent messages
    - whole point being, to effectively extend context continuously
    - costly, though, so getting smart about them is good
    - how dumb or smart? not sure, maybe both

<-> easy front-end switches to enable / disable each feature as needed. 

```example

user memory: 
  entities mentioned: 
  {database.users.entities[{user_id}]}
  knowledge mentioned:
  {database.users.knowledge[{user_id}]}

conversation memory:
{database.history_buffers[{uid:user_id,cid:conversation_id}]}
{database.summaries[{uid:user_id,cid:conversation_id}]}
{historybuffer.length<20?database.vectorstores[{uid:user_id,cid:conversation_id}.query(history_buffer[-3])]}

```

dataset - my discord server


vector-memory-back:
- 

"the ghost draft" -> before the rough draft


onboarding task:
- pick one, be specific, show it to a specific person.
- generalizing: "pick your own topic"


conceptual thoughts:
- output parsers:
  - can add "reminders" and "to-dos" to a running list the AI keeps track of
  - helpful when there's an agenda, like "talk about and demonstrate all of these topics"

IDE ideas:
  - database / vectorstore browsers (with visuals)
  - langflow vibes (advanced) 
  - conversation branch visualizer (with llm summarization for node names!)


Eternal conversation memory (Snapback/Scrollback/Jumpback Memory):
- all messages from chat history are stored in vectorstore
- then we do it layered:
  - generous buffer window for perfect recency -- this is still primary, and many conversations will never leave this phase
  - rolling summary of full conversation, updated regularly -- this helps keep things going if the conversation goes very long
  - dumb/fast vectorstore for recently lost messages
  - slower/deeper vectorstore that holds the entire history of the conversation
    - triggers on the most recent N messages
    - returns the M closest
    - some distance cutoff needs to be set, I guess?
  - simple version should be relatively easy to achieve. 

tree navigation data model for frontend:
- full tree is stored as "conversation"
  - "current path" is also stored
  - a flat "conversation text" model is under "computed", uses conversation + path to compute the flat text


hyper-agent:
- enhanced memory across the conversation history
- branches in conversation, easily visualized and navigated
  - memory structure computes a flat version, too
- possesses stable entity memory, for understanding People, Places, Things, etc. atomic knowledge across all your conversations