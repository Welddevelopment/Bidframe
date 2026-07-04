# Slack + Claude — team setup & norms

**Why:** AI in the loop for team comms — the YC "AI-native company" playbook (Diana Hu). Slack is
the human + AI layer; the `comms/` boards stay the agent-to-agent bus; a daily routine bridges them
one-way so nobody has to read raw markdown to know what shipped.

> **Timing note:** this is founding infrastructure for *after* demo day. None of it blocks the
> pitch. Each person's one-time setup is ~5 minutes — do it whenever you have a gap, no rush.

## One-time setup (each person, ~5 min)

1. In the Bidframe Slack, open the **Claude** app (Apps section in the left sidebar — if it's not
   there yet, Bobby installs it workspace-wide first; see "Admin setup" below).
2. Click **Connect** and sign in with **your own** Claude account (everyone has Pro/Max — no new
   spend, no shared account).
3. Done — @Claude now answers you in any channel it's been invited to.
4. Recommended: connect **GitHub** on your Claude account
   (claude.ai → Settings → Connectors → GitHub) so you can kick off coding work from Slack.

## Admin setup (Bobby, one-time)

1. Confirm the workspace is on a **paid** Slack plan — the Claude app is only available to users on
   paid Slack plans. (Slack → workspace name → Settings & administration → Billing. Pro ≈ £7/user/mo.)
2. Install the Claude app workspace-wide from the Slack Marketplace, then `/invite @Claude` into
   `#standup`, `#ship`, `#ai-playground`, and the main working channel.
3. Authorize the **Slack** connector on your claude.ai account (Settings → Connectors → OAuth into
   the workspace). Note: this connector is separate from the @Claude Slack app in steps 1–2.
4. Give the digest routine **commit-level** repo access — attach the repo so the routine clones it
   and runs `git log`, or attach a GitHub connector that lists commits. The read-only claude.ai
   GitHub file-sync integration syncs file contents only and does NOT read commit history, so it's
   not enough for the digest on its own. Full details in `prompts/standup-digest-routine.md`.

## Channels

| Channel | Purpose |
|---|---|
| `#standup` | Automated daily digest at 09:00 UK; reply in-thread. |
| `#ship` | Post when you ship. Tag @Claude to draft the announcement. |
| `#ai-playground` | Try things. No norms. |

## How to use @Claude

- **Always reply in a thread** — keeps channels readable.
- Good uses: "summarize this thread", "draft a reply to this buyer email", "what did we decide
  about the schema?", "review this stack trace".
- **Coding tasks:** a mention like *"@Claude fix the failing lint in `frontend/`, open a PR"*
  launches a Claude Code session; progress and a Create-PR button come back to the thread.
  Requires **your** GitHub connector (step 4 above).
- **Never paste:** client-confidential tender content, `.env` values, API keys, or credentials.

## What's automated

- **Daily standup digest** — 09:00 Europe/London → `#standup`. Reads the last 24h of commits +
  `comms/board-*.md` + `STATUS.md` and posts a plain-English summary. Prompt + setup caveats are
  versioned at [`prompts/standup-digest-routine.md`](prompts/standup-digest-routine.md); it runs as
  a **Remote** routine on Bobby's claude.ai account (claude.ai/code/routines). If it misses a
  morning, tell Bobby and open that run's transcript — failures surface there, not on the green
  status dot. Tokens auto-refresh, so a miss usually means a connector lost its authorization.

## Dates to know

- **2026-07-18 — sunset review:** are the `comms/` boards still earning their keep, or do we go
  Slack-primary and retire them? (If retired, update AGENTS.md + STATUS.md.)
- **2026-08-03 — Claude Tag transition:** Anthropic moves the Slack app to an org-managed identity
  (needs a Claude Team plan). Our per-user setup works until then; revisit when Bidframe buys a
  Team plan.
