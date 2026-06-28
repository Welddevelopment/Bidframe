# Agent Comms — how the four agents talk

A git-native async message channel. We don't share a live chat, but we share `main` — so the repo
*is* the bus. This folder is where the agents (and humans) leave messages for each other.

## The golden rule: write only your OWN feed

| You are | You WRITE (append to) | You READ |
|---------|----------------------|----------|
| Backend agent | `comms/board-backend.md` | all four boards |
| Frontend agent | `comms/board-frontend.md` | all four boards |
| Generalist agent | `comms/board-generalist.md` | all four boards |
| J agent | `comms/board-j.md` | all four boards |

**Why per-role files:** two agents appending to the *same* file at the same time = a merge conflict.
If each agent only ever writes its own board, concurrent pushes never collide. This mirrors
"stay in your lane" for code — same idea, applied to messages.

## When to use comms vs STATUS.md

- **`STATUS.md`** = the *current state* snapshot ("where is each role right now"). Overwrite/update.
- **`comms/board-*.md`** = the *conversation* — questions, requests, answers, heads-ups, decisions.
  **Append-only**, newest at the top. Think of it as your outbox/feed.

## How to post (every session)

1. **On startup: read all four boards** (and `STATUS.md`). Anything addressed `@you` that's `OPEN` is your inbox.
2. **To post:** append an entry to *your* board, newest at top, using the format below.
3. **To answer someone:** post on *your* board, tag them, and reference their entry id. Then, if it
   resolves their request, they (or you) flip the original to `RESOLVED` on the next edit of that board.
4. Commit + push like any change (`git pull --rebase` first). Keep messages short and scannable.

## Entry format

```
### [B-007] @generalist · REQUEST · OPEN · 2026-06-28
Raw-extraction format v1 is up (prompts/raw-extraction-format.md). Please review + sign off so you
can build reconcile against the real shape. Anything you'd change?
```

- **id:** `<role-letter>-<n>` — B=backend, F=frontend, G=generalist, J=j. Increment per board.
- **@who:** the role you're addressing (`@all` for everyone). 
- **type:** `INFO` · `QUESTION` · `REQUEST` · `ANSWER` · `BLOCKER` · `DECISION`.
- **state:** `OPEN` (needs a response/action) or `RESOLVED` (done — say how).
- **date**, then a 1–3 line body. Link files/ids where useful.

## Etiquette
- One topic per entry. Don't rewrite history — to update, add a new entry or flip the state line.
- A `BLOCKER` means you're stuck waiting on someone — tag them, they prioritise it.
- Resolve loudly: when you action a REQUEST, post an ANSWER and flip the original to RESOLVED.
