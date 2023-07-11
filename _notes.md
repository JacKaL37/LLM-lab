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

- abstract out the codeblock component

- streaming, how-do. (earlier is better, as it seems fundamental to the data flow pattern.)

- incorporate typesecript

- install langchainjs


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

- bring in vueflow - https://vueflow.dev/
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

- two servers
  - context server
  - user server
  - 

? should the server be stateless?
  - API key needs to be back there
  - also, when databases and vectorstores become part of the equation
  - otherwise, keeps all the important stuff in the app's front-end
  - server serves as a router more than anything. 


- MVP 
  - standard paper digester agent
  - also an investigator script for the litany against fear





conceptual thoughts:
- output parsers:
  - can add "reminders" and "to-dos" to a running list the AI keeps track of
  - helpful when there's an agenda, like "talk about and demonstrate all of these topics"