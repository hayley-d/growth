# GenAI log

The spec says: "You may make use of Generative AI (GenAI) to help generate the content for your app and if you need, the GUI. Please acknowledge that you made use of GenAI and include your prompt and the tool you used in your ID documentation."

Prompts are gone once a chat is closed, and commits never carry AI attribution (root rule 1). So this folder is the only record. The GenAI page of the ID document is built from it at the end.

## Where things go

```
genai/
  tools.md                        every tool and model we used, and for what
  log/
    YYYY-MM-DD-<short-name>.md    one file per piece of content, GUI or docs work
```

One file per entry, so two people never edit the same file and merges never conflict.

## What to record

| What the AI made | What to record |
| --- | --- |
| App content: lesson text, worked examples, quiz questions, hints, scaffolding text | A log entry with every prompt |
| GUI: screens, layouts, components, images, colour schemes | A log entry with every prompt |
| Docs: SE and ID pages, docs site pages, agent files | A log entry with every prompt |
| Code with nothing learners see: stores, API routes, tests, config | Only a row in `tools.md` |

Anything that changes what learners see counts as content, even when the team wrote the lesson in the prompt and the AI only built it. Log it anyway. A detailed prompt shows the team did the design.

## Rules

- Add the log entry in the same commit as the work it describes.
- Copy prompts exactly as the user wrote them. Never summarise them, fix typos or merge two into one.
- Include follow-up prompts that changed the output, in order. Leave out ones that only asked a question or changed nothing.
- Use your exact model id, like `claude-opus-5-5`, not a nickname.
- If a prompt holds a password, key, email address or other personal detail, replace it with `[removed]` and say so under "What we changed".
- If a person edits or throws away the output afterwards, note it under "What we changed".
- When you write code, check your tool and model are in `tools.md` for that kind of work. Add a row if not. Don't add a row per session.
- Work done outside an agent, like ChatGPT in a browser, is logged by hand with the same template.

## Entry template

```md
---
date: YYYY-MM-DD
who: <team member>
tool: <tool, like Claude Code>
model: <exact model id>
kind: content | gui | docs
files:
  - <paths the output went into>
---

## Used for

One or two sentences.

## Prompts

### 1

<the exact prompt>

### 2

<the next prompt that changed the output>

## What we changed

What a person edited or threw away afterwards. "Nothing" is fine.
```
