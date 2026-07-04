# Slack + Claude Integration — Design

**Date:** 2026-07-04 · **Owner:** Generalist · **Status:** approved direction, pending paid-Slack-plan check

## Goal

Put AI inside the Bidframe team's communication loop (YC "AI-native company" playbook): @Claude
available in team channels, Claude Code sessions able to read/post Slack, one automated daily
digest bridging the git-native agent bus into Slack, and the ability to kick off coding work from
a Slack mention.

## Decisions made

- **Approach: official products only** — Anthropic's Claude app for Slack, the Slack MCP
  connector, and one Claude Code cloud routine. No custom bot, nothing to host or maintain.
- **`comms/` boards stay** as the agent-to-agent bus; Slack is the human + AI layer. Bridge is
  **one-way** (repo → Slack daily digest). **Sunset test 2026-07-18:** if boards are only written
  to feed the digest, retire them and go Slack-primary.
- **Per-user Claude accounts** (all four have personal Pro/Max plans) — no Team plan purchase now.
- Slack workspace exists; the user is admin, so no approval chain for app installs.

## Architecture (four phases)

1. **@Claude in channels** — install the official Claude app from the Slack Marketplace; each
   teammate connects their own Claude account; invite @Claude to working channels.
2. **Claude Code ↔ Slack** — authorize the Slack connector on the owner's claude.ai account
   (OAuth, human step); Claude Code sessions can then read/search/post Slack.
3. **Automated daily digest** — a cloud routine (claude.ai/code/routines, daily 09:00
   Europe/London) reads last-24h commits + `comms/board-*.md` + `STATUS.md` via the GitHub
   connector and posts a plain-English digest to `#standup` via the Slack connector.
4. **Kick off work from Slack** — enable Claude Code routing in the Slack app; a coding
   @Claude mention launches a Claude Code web session that reports progress + "Create PR" back
   into the thread (requires the triggering user's GitHub connector).

## Repo artifacts

- `slack-setup.md` (root) — team-facing setup checklist + usage norms + key dates.
- `prompts/standup-digest-routine.md` — the routine's prompt, versioned like the other prompts.
- A `comms/board-generalist.md` entry announcing what's live and each person's 5-minute action.

## Non-goals (explicitly cut)

- Custom Slack bot on the Agent SDK (plumbing, not product, for a 4-person team).
- Two-way comms/ ↔ Slack sync (one-way digest only).
- Claude Code GitHub Action (defer until real CI exists).
- Claude Team plan / Claude Tag migration (revisit at the 2026-08-03 transition).

## Risks / preconditions

- **Paid Slack plan required** for the @Claude app — unconfirmed; Phase 0 checks it (upgrade
  ≈ £7/user/mo on Pro if needed).
- **Claude Tag transition 2026-08-03** — per-user app setups keep working until then; calendar
  note, not a blocker.
- **Headless routine auth fails silently** if the Slack/GitHub connector token lapses — the plan
  includes a manual first run and a weekly human glance at #standup.

## Success criteria

- Any teammate can @Claude in a channel and get an answer in-thread.
- A Claude Code session can post a message to `#ai-playground` on request.
- The digest appears in `#standup` at 09:00 UK without human action, accurately reflecting the
  previous day's commits and board posts.
- A coding @Claude mention in Slack produces a Claude Code session and a PR link in the thread.
