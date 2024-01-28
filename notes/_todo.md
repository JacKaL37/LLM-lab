Roll for shoes - an interactive fiction game

https://anydice.com/

PROMPTING: 

MVPrompt:
- base prompt in the file
  - https://rollforshoes.com/ 
  - 1. Say what you do and roll a number of D6s, determined by the level of relevant skill you have.
  - 2. If the sum of your roll is higher than the opposing roll, the thing you wanted to happen, happens.
  - 3. At start, you have only one skill: `Do Anything 1`.
  - 4. If you roll all sixes, you get a new skill specific to the action, one level higher than the one you used.
  - 5. For every roll you fail, you get 1 XP.
  - 6. XP can be used to change a die into a 6 for advancement purposes only.
- state fence/table:
  - current xp
  - current skill list
- gming and improv: 
  - feel free to ask for more more description, clarification, etc-- this is a narrative game, and you need something to generate new skills from. 
  - "yes, and"
  - can push back on users, but give sound reasoning, and aim for a "no, but"
  - when doing the opposing roll, justify the LEVEL of the opposing roll, and sum the appropriate number of the rolls sent.
    - https://rpg.stackexchange.com/questions/61949/how-many-dice-does-the-gm-roll-when-challenging-the-players 
    - no roll: trivial tasks
    - 1d6: ordinary tasks
    - 2d6: challenging tasks
    - 3d6: heroic tasks
    - 4d6: nearly impossible tasks
- values: 
  - fun, funny, absurdism, rule of cool
  - surrealism and existentialism (when earned)
- formatting: once the roleplay begins, bot should denote types of text using markdown: 
  - out of character (ooc): *italics*, always in separate paragraphs
  - narration: plaintext
    - skills in narration: `skill name #`
  - dialogue, including speaker name and a face emoji to denote their mood for each spoken line: 
    - > `Name` 
    - > `😵"thing they said"`
    - > `😡"more of what they said, if the mood changed before they were done"`
  - sensory descriptions, line by line, short and poetic, with non-face emoji if they contribute:
    - > `🪨the description of the sensory experience of the scene`
  - the user may deviate from these conventions, or approximate them, be cool. 
- user may send a table of 6 player and 6 opposed rolls, use them or ignore them as appropriate. 

- add to cogmate: simple button to tack on a table of d6 rolls to the prompt before sending
  - 6d6 player rolls (left to right priority)
  - 6d6 opposed rolls (left to right priority)
  - rows: player, opposed; columns, Lv1, Lv2, Lv3, Lv4, Lv5, Lv6; data: d6 result. 

- discord bot: add a /roll call that dumps out the same in a code fence, user can then copy-paste 'em.



- "tables":
  - when "generating" narrative elements that could come from tables, the model should "roll" items from the table categories and denote the `result` in an in-line code fence when responding. 
  - base table names: body parts, specific body parts, npc decription words, npc personality words
  - scenario table names: npc nouns, npc forms, narrative twists, dangers, etc., and denote the results 
- fudged opposing rolls: report the number to beat with a quick reason along with the description of the outcome, like "because the dance you're trying to pull off is incredible, you had to beat a 19". 
  - alternatively, it can just justify the LEVEL CATEGORY of the opposing roll, and use the rolls sent. 
- idea of "world" as an npc with its own skills to track that can be applied anywhere.

--

- hardmode expansion: 
  - extras: https://rollforshoes.com/extras/
  - weaknesses, statuses, and damage.
  - I think I can just prompt these in, by giving the rules and adding them to the state fence

----

- gm tips expansion:
  - instructions on how to GM
    - like knowing it can push back on an action's definition or etc
    - but to remember the rule of cool
    - you can do anything, but you can't do everything
  - improv tips
    - yes, and
    - no, but

- scenarios expansion: 
  - example scenarios: https://rollforshoes.com/scenarios/
    - intro, segments, specifically relvant random tables.
    - ! may want to pregenerate these with a separate call, and store them separately

------

MEMORY:
- the... infinite... expansion.
  - deep vectorstore bullshit...
    - keep an ever-expanding list of skills and their levels
    - which could belong to various entities
      - NPCs... items?
      - which could have relationships with other entities
      - those entities' relationships
      - how those entities behave
      - historical summaries of those entities
    - and knowledge graphs
    - all in a vectorstore that can be summoned up with every SINGLE SEND
    - This would be an incredible test of the growth of a large scale fictional knowledge network 

TOOLS: 

- user dice rolls
  - *why not to: can just do the 20 scattershot and see how it goes*

- ? OPPOSING rolls, hmmm... 
  - separate LLM jumps in, assesses the situation, comes up with a schema for the opposing roll
    - then it executes that roll (function calling or something)
    - and hands the number-to-beat backl to the main agent
  - *why not to: we can just trust the GM, maybe nudge it with a prompt*
  - *why TO do: increases trust, "third" party, etc*

- random table rolls 
  - https://rollforshoes.com/tools/
  - just for anything we don't want the llm to have to make up.
  - could be done in a big bundle, consulting a bunch of backend random tables using a query (sql?)
  - *why not to: we can just trust the GM, maybe nudge it with a prompt*

- GM scratchpad (raw, json, yaml, toml)
  - for storing things like descriptions, plans, 
  - this could be another "tool", but it would be a tool that feeds into "monitor" (i.e., an always-included chunk of the context window)
  - *genuinely love this idea, and I think it bleeds into this interesting concept below.*


MONITORS: the monitor concept is: "a tool that I can always see the current status of"
  - scratchpad
  - user skills
  - user xp


- ??? philosophical question: dice roll-- where and when
  - manually entered solutions: 
    - other discord bots, google, physical rolling, whatever. 
  - frontend:
    - inject roll results into the message send itself
      - to encourage back-and-forth, would need to prompt "it's okay to reject a roll and ask for a different one if you think it fits better. you're the GM after all"
  - backend: 
    - api to inject dice rolls (lol why)
    - a dice-roll-specific API! (ew, so go backend, then back to frontend, then BACK TO BACKEND? gross)
  - agentic kinda seems like the way to go
    - allows for almost all of these
    - like, the autonomy of them is appealing

  - sloppier: could also play the shotgun route where the user:
    - says what they want to do (can be sloppier here, which is good)
    - and just sends a large list of d6s and tells the LLM to pick the ability involved and only look at the correct number of d6 results
      - but this is bad, because the model is famously troubled by sorting through lots of numbers with positional meaning. think tables. 🎲
- ?? how to get this to be "multiplayer"...?
  - trickyyyyy
  - could delay the request if more players want to enter text
  - GM could have an "address specific player" tool and treat them as an input as desired



-------------




Conversation Tree Navigation
- use composition api, dawg. (thanks claaaaude)
- consider pidia for state management
  - little fuckery there if you wanna use scoped states for a super-app
  - simple pimple first, use global state, because---
- refocus on the single conversation agent experience
- get langsmith going
  - api fuckery
  - but this will be perfect for student sessions (FREE DATA COLLECTION!!)


Token Progress Bar
- helps user track number of "high accuracy" messages are left in the context
  - individual messages will be visible
- and pie chart!

TODO list feature (KANBAN?)--
- high impact, minimum space tool
- a data structure that both the user and the model can alter 
  - list of completed items
  - list of current to-do items
  - currently selected focus item
- has a front-end component so that the user can track it separately from the conversation itself
- user has complete control, can lock items, can un-complete items, etc
- AI can add items and suggest completed items
  - does this through the use of functions or output parsers, reduced language like "mark(itemA, true)" to mark something complete, or "newItem(itemX)"


data woes
- try to finish retrieving some sort of yahoo.json 
  - implement a vectorstore 
  - at end of conversation, spit out most relevant yahoo answer thread. 
- alternatively, scrape a server. 
  - quarantimes
  - lab
  - ???

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
  - non-shitty conversation memory management
  - token cost estimation-- critical for users to learn
  - persistent memory somehow: local storage, or database? both viable. 
  - download conversation histories (or even just copy)
  - student conversation golemstrings:
    - conversation duration steering advice: "when the conversation is at about 1000 words, start wrapping it up, thanking them for their time, then wrap up the conversation with the haiku"
    - paper contents (vectorstore? or just in context?), 
    - open-ended prompt for the whole conversation-- e.g., my "Final Thought" journal prompts
    - student interest profiles, potentially! 
  - IDs / login / identity management
  