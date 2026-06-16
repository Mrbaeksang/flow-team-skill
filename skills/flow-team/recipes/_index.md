# Recipes — the API-combination catalog

Each recipe in this folder is a **set**: a specific way of combining Flow API calls to do one
useful thing. Every recipe starts with machine-readable frontmatter so the agent can recommend
the right ones for *this* user:

```yaml
---
id: overdue-triage          # unique slug
title: 마감 트리아지          # human name
what: 한 줄 설명
apis: [tasks/filter, ...]   # which Flow calls it combines
mode: read | write          # does it change the workspace?
signals: [overdue>0]        # when it's useful (matched against the user's profile)
script: null                # npm script name if runnable, else null
---
```

## Recommendation flow (맞춤 추천)

When the user asks *"뭘 자동화하면 좋을까?"* / *"추천해줘"*:

1. Run `node scripts/recommend.mjs` (it runs `profile.mjs` against the user's key to compute
   **signals** — overdue, unreadMentions, ownerless, noDeadline, projects, weekMeetings, …).
2. It evaluates each recipe's `signals` against those numbers and prints a ranked, **personalized**
   shortlist with the actual figures ("밀린 8건이라 마감 트리아지 0순위").
3. Offer to run the top recipe. Confirm before any `write`.

## Authoring your own (커스텀)

Copy [`_TEMPLATE.md`](_TEMPLATE.md), fill the frontmatter + steps, drop it here. The agent picks
it up automatically — both for recommendations and to execute. Ask the agent: *"이런 레시피 만들어줘:
…"* and it will scaffold the card (and a script if needed) for you.
