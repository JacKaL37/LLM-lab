# Whoops

Spent $80 in one week using GPT-4 to develop GPT-4. 

My b, breh. 

# Pricing

## GPT-4 
- 8k context, $0.03/1k in, $0.06/1k out
- 32k context, $0.06/1k in, $0.12/1k out

## GPT-3.5 Turbo

- 4k context, $0.0015/1k in, $0.002/1k out
- 16k context, $0.003/1k in, $0.004/1k out

## Ada v2 (embeddings)

- embeddings, $0.0001/1k 

# Analysis

out always costs more, and it does more of the talking anyway usually, so, let's use out as the high bar here

Per million:
- GPT-4:   $60 - $120
- GPT-3.5: $2 - $4
- Ada v2:  $0.10

So, interacting with it consistently and wildly inefficiently for a week cost me $80. 
So like, 1.3 million tokens.

I don't regret it, but it's time to change shit up. 

# GPT Frontend - Is it worth it?

Just remember that this exists and you're paying for it.
Comes with no token caps, only message exchange caps.

50 / 3 hours -> 400 message exchanges *per day*

Let's contrast with my requests this month:
- 8/11 - 3 requests
- 8/12 - 289 requests
- 8/13 - 85 requests
- 8/14 - 3 requests
- 8/15 - 214 requests
- 8/16 - 89 requests

Total requests -> 683 over this week

Realcost: $80 / 683 calls = ~12 cents per call, on average. 
(interestingly, also implies the average message size per call is ~2k tokens)

So, if I have similar exchanges on the openai frontend, at around 2k tokens and 12 cents per message...

A single day of, let's assume 200 messages slightly more realistically than the true max...
It pays for itself in a single day, being "worth" $24 a day.  

Yeah, it's fucking worth $20 a month for what they're giving away here. 

# Remediation
- Tool change: Use GPT-3.5 for the vast majority of development. 
  - it still provides a pretty good experience, too. nothin' wrong with this guy. 
- Development: Stop fucking testing at the END of LONG CONVERSATION CHAINS. 
  - and be more careful about separating collaboration and testing--> leads to these long conversations bleeding into bug tetsting chains. Consider separating out the tool-version from the active-development version (not using your GPT frontend subscription is pretttty stupid, bruh)
- Deployed for others: Have model tend toward ending the conversation after several exchanges. 
- Structure: manage conversation memory better! keep a running summary, and the buffer window a little less... eternal. 
- Warnings: Implement something like the following code 
  - or consider `npm install tiktoken-node`
  - https://platform.openai.com/tokenizer 

```python
def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0613"):
  """Returns the number of tokens used by a list of messages."""
  try:
      encoding = tiktoken.encoding_for_model(model)
  except KeyError:
      encoding = tiktoken.get_encoding("cl100k_base")
  if model == "gpt-3.5-turbo-0613":  # note: future models may deviate from this
      num_tokens = 0
      for message in messages:
          num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
          for key, value in message.items():
              num_tokens += len(encoding.encode(value))
              if key == "name":  # if there's a name, the role is omitted
                  num_tokens += -1  # role is always required and always 1 token
      num_tokens += 2  # every reply is primed with <im_start>assistant
      return num_tokens
  else:
      raise NotImplementedError(f"""num_tokens_from_messages() is not presently implemented for model {model}.
  See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens.""")
```

# Takehome

It's easy to blast your cache if you're not careful of things like needlessly sending whole conversations, using GPT-4 when you're just bug testing, and also when your system doesn't warn you about token costs.  

GPT-3.5, even at max context, is still 1/15th the cost of GPT-4. 1/30th if you're using the smaller context version. 

And probably best to consult the paid subscription frontend gpt critter for assistance, rather then *the one you're actively developing and doing tons of useless overloaded calls to bug test*. 