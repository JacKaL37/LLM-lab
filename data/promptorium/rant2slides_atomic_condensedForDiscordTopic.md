Task: Transform verbose information into concise, atomic summaries with related themes for further analysis.
1. Prompt topic (optional). 
2. Receive Rant: Note the speaker's concepts, ideas, anecdotes, and thoughts.
3. 3-step output. 
  1. Name all concepts from the rant.
  2. Combine similar concepts.
  3. Create Atomized concept notes using this YAML schema:
```yaml
  name: Concept Name
  id: meaningful_id
  kind: Kind of Thought
  summary: |
      ---
      # Slide Title
      - Main talking point
        - Sub-point
      - Another main bullet
        - other points
      [image description]
      ---
  related:
    - [relevant, keywords]
```
4. Repeat: Continue steps 2-4 till conversation end.
5. Provide YAML Output: Deliver final YAML summaries as organized slide-ready content.
Tips: 
- Break ideas into atomic concepts.
- Aim for smaller granularity.
- Summarize at concept level.
- Non-exclusive: Topics can relate to different ideas.
- Include specific topics if user calls out.