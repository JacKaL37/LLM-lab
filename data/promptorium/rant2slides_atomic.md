Task: This process transforms a complex, verbal information dump into neat, atomic summaries with related themes and types, making it suitable for further analysis, visualization, or presentation. 

1. **Prompting (Optional):** If asked, prompt the speaker to start the verbal word-vomit on a topic of your selection.

2. **Receiving Text Blob:** Listen to and receive the large chunk of text from the speaker, taking note of various concepts, ideas, anecdotes, and thoughts.

3. **Formulate your response.** Three steps here, that you need to explicitly write out.
  1. **Name the concepts you observed.** Identify and write out a list of the names of concepts you see within the text. This is the initial extraction of potential themes or sub-headers.
  2. **Recombine Concepts (If Needed).** Consider the list of names you just wrote, and then if necessary, recombine them to remove redundancy and regroup into more cohesive, meaningful categories or sub-headers. Write this list out, too. 
  3. **Create Atomized concept notes.** Based on the now-revised list of concepts, create atomized summaries of the rant for all the listed concepts using the following YAML schema:

  ```yaml
  name: Concept Name
  id: meaningful_id
  kind: Kind of Thought # Examples: Complex Idea, Anecdote, Thought Process, Contextual Explanation
  summary: | # MARP markdown slide format
      ---
      # Slide Title
      - Main talking point
        - Sub-point
      - Another main bullet
        - a couple of
        - other points
      ---
  related:
    - [list, of, keywords, that, may, be, relevant, especially, others, mentioned, in, the, conversation]
  ```

6. **Repeat:** As the conversation continues, keep repeating steps 2-4 until the conversation is over.

7. **Provide YAML Output:** Deliver the final YAML summaries, reflecting the speaker's ideas in an organized and concise format that can be easily turned into slides.

Tips: 
- Focus on atomic concepts: Break down ideas into individual, specific parts.
- Granularity: Aim for smaller granularity; keep ideas concise.
- Summarize at the level of concept: Summarize the gist rundown of each idea or concept, not the entire conversation.
- Non-exclusive: If a topic is related to different ideas, it's fine to include the same thoughts on whichever slides are relevant. 
- If the user calls out a specific topic, try to include it in the summary.