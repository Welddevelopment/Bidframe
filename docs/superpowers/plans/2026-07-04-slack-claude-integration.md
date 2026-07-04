# Slack + Claude Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put AI in the Bidframe team's communication loop: @Claude in Slack channels, Claude Code ↔ Slack connectivity, an automated daily standup digest bridging the git comms bus into Slack, and Slack-triggered coding sessions.

**Architecture:** Official Anthropic products only — the Claude app for Slack (per-user Claude accounts), the Slack + GitHub MCP connectors on the owner's claude.ai account, and one cloud routine for the daily digest. Repo artifacts (`slack-setup.md`, `prompts/standup-digest-routine.md`, a comms board entry) document and version everything.

**Tech Stack:** Slack (paid plan), Claude app for Slack, claude.ai connectors (Slack, GitHub), Claude Code cloud routines, git.

**Spec:** `docs/superpowers/specs/2026-07-04-slack-claude-integration-design.md`

---

## How to execute this plan

Tasks marked **⛔ HUMAN GATE** are browser/OAuth/admin actions the agent CANNOT perform — stop
and ask the human to do them, then verify before continuing. Agent tasks are ordinary file edits
+ commits. There is no test suite for this work; every task has an explicit manual verification
step instead — do not skip those.

**Git rules (from AGENTS.md):** work on `main`, `git pull --rebase` before starting AND before
pushing, commit small with clear messages, never push a broken state. All files in this plan are
Markdown docs — "broken" here means placeholder text (`<REPO_URL>` etc.) left unfilled.

---

### Task 1: ⛔ HUMAN GATE — Slack plan + channels (Phase 0)

No files. Human does this in the Slack admin UI (~5 min).

- [ ] **Step 1: Confirm the workspace is on a paid Slack plan.** Slack → workspace name →
  Settings & administration → Billing. The @Claude app is only available to users on paid Slack
  plans. If free: upgrade to Pro (≈ £7/user/mo, 4 users).
- [ ] **Step 2: Create (or confirm) three channels:** `#standup` (digest lands here), `#ship`
  (release/shipping announcements), `#ai-playground` (experiments, no norms).
- [ ] **Step 3: Report back** the workspace name and confirm the three channels exist. The agent
  records the workspace name in `slack-setup.md` in Task 2 (replace `<WORKSPACE>`).

### Task 2: Write the team setup + norms doc

> ✅ **ALREADY DONE (2026-07-04).** `slack-setup.md` is authored and committed with real values (no
> `<WORKSPACE>`/`<OWNER>` placeholders) plus the doc-verified corrections. Treat the committed file
> as the source of truth; the inline draft below is the earlier version, kept for reference. Skip to
> Task 4 unless you want to review it.

**Files:**
- Create: `slack-setup.md` (repo root — sits alongside `sourcing-playbook.md` etc.)

- [ ] **Step 1: Pull latest** — `git pull --rebase`.
- [ ] **Step 2: Create `slack-setup.md`** with exactly this content, replacing `<WORKSPACE>` with
  the workspace name from Task 1 and `<OWNER>` with the Generalist's name:

```markdown
# Slack + Claude — team setup & norms

Why: AI in the loop for team comms (YC AI-native playbook — Diana Hu). Slack is the human + AI
layer; the `comms/` boards stay the agent-to-agent bus; a daily routine bridges them one-way.

## One-time setup (each person, ~5 min)

1. In the `<WORKSPACE>` Slack, open the **Claude** app (Apps section in the sidebar).
2. Click **Connect** and sign in with **your own** Claude account (everyone has Pro/Max).
3. Done — @Claude now answers you in any channel it has been invited to.
4. Optional but recommended: connect GitHub on your Claude account
   (claude.ai → Settings → Connectors → GitHub) so you can kick off coding work from Slack.

## Channels

| Channel | Purpose |
|---|---|
| `#standup` | Automated daily digest at 09:00 UK; reply in thread. |
| `#ship` | Post when you ship. Tag @Claude to draft announcements. |
| `#ai-playground` | Try things. No norms. |

## How to use @Claude

- **Always reply in a thread** — keeps channels readable.
- Good uses: "summarize this thread", "draft a reply to this email", "what did we decide about
  the schema?", "review this error".
- **Coding tasks:** a mention like "@Claude fix the failing lint in `frontend/`, open a PR"
  launches a Claude Code web session; progress and a Create PR button come back to the thread.
  Requires YOUR GitHub connector (step 4 above).
- **Never paste:** client-confidential tender content, `.env` values, API keys, credentials.

## What's automated

- **Daily standup digest** — 09:00 Europe/London, posts to `#standup`. Reads the last 24h of
  commits + `comms/board-*.md` + `STATUS.md`. Prompt is versioned at
  `prompts/standup-digest-routine.md`; the routine runs on <OWNER>'s claude.ai account
  (claude.ai/code/routines). If it misses a morning, tell <OWNER> — the connector token
  probably lapsed.

## Dates to know

- **2026-07-18 — sunset review:** are the `comms/` boards still pulling their weight, or do we
  go Slack-primary and retire them?
- **2026-08-03 — Claude Tag transition:** Anthropic migrates the Slack app to an org-managed
  identity (needs Claude Team plan). Our per-user setup works until then; revisit when Bidframe
  buys a Team plan.
```

- [ ] **Step 3: Verify no placeholders remain** — search the file for `<WORKSPACE>` and
  `<OWNER>`; both must be replaced with real values.
- [ ] **Step 4: Commit**

```bash
git add slack-setup.md
git commit -m "docs: Slack + Claude team setup guide and norms"
git pull --rebase && git push
```

### Task 3: Write the digest routine prompt

> ✅ **ALREADY DONE (2026-07-04).** `prompts/standup-digest-routine.md` is authored and committed
> with the real repo URL and the corrected prompt (verified against live docs). **Do NOT reuse the
> early inline draft that used to live here** — verification caught two real errors in it: (1) it
> assumed the GitHub connector can read commit history, but the read-only claude.ai file-sync
> integration syncs file *contents* only, so the routine needs the repo cloned (`git log`) or a
> commit-listing GitHub connector; and (2) it lacked a "post exactly once / ground only in retrieved
> data" guard that an unattended daily run needs to avoid duplicate or hallucinated posts. The
> committed file fixes both — read it directly.

**Files:**
- Created: `prompts/standup-digest-routine.md` (already committed — source of truth for the prompt)

### Task 4: ⛔ HUMAN GATE — install the @Claude Slack app (Phase 1)

No files. Human does this in Slack + browser (~15 min for the admin, ~5 min per teammate).

- [ ] **Step 1 (admin):** Go to the Slack Marketplace listing for Claude
  (https://slack.com/marketplace/A08SF47R6P4-claude) → **Add to Slack** → approve for the
  workspace.
- [ ] **Step 2 (everyone):** Each teammate opens the Claude app in the Slack sidebar → Connect →
  signs in with their own Claude account. Send them the `slack-setup.md` link — it's the
  self-serve version of this step.
- [ ] **Step 3 (admin):** In each of `#standup`, `#ship`, `#ai-playground` (and the main working
  channel), run `/invite @Claude`.
- [ ] **Step 4 (verify):** In `#ai-playground`, post: `@Claude summarize what the Bidframe
  project is in two sentences.` Expected: Claude replies in a thread within ~30s. If it errors
  about the account, the user's Claude connection in Step 2 didn't complete.

### Task 5: ⛔ HUMAN GATE — authorize the Slack + GitHub connectors (Phase 2)

No files. Human does this in a browser (~5 min). These connectors power BOTH ad-hoc Claude Code
↔ Slack use and the Task 6/7 automation, so do it on the Generalist's claude.ai account.

- [ ] **Step 1:** Go to claude.ai → Settings → Connectors → add **Slack** → OAuth into the team
  workspace. (Alternative: run `/mcp` in an interactive `claude` CLI session and authorize the
  Slack plugin there.) Note this Slack **connector** is separate from the @Claude Slack **app** in
  Task 4. On Team/Enterprise an org Owner must enable the connector before members can authorize it.
- [ ] **Step 2:** Arrange **commit-level** repo access for the digest routine. The standard
  claude.ai GitHub connector only syncs file *contents* — it does NOT expose commit history, so it
  alone can't drive the digest. Plan to either attach the repo to the routine so it clones and runs
  `git log` (preferred), or connect a GitHub connector that lists commits. Confirm GitHub is
  connected on the account either way; the exact attachment happens in Task 7.
- [ ] **Step 3:** Tell the executing agent it's done, so it can run the Task 6 verification.

### Task 6: Verify Claude Code can reach Slack

No files — this is the agent-side verification of Task 5.

- [ ] **Step 1 (agent):** In a Claude Code session on this machine, load the Slack MCP tools
  (ToolSearch for `slack`) and list channels. Expected: the tool schemas load and the team
  workspace's channels (including `#ai-playground`) appear. If the tools report "requires
  authentication", Task 5 Step 1 didn't complete — stop and re-gate.
- [ ] **Step 2 (agent):** Post a test message to `#ai-playground`:
  `Claude Code ↔ Slack link is live. — posted from a Claude Code session`
- [ ] **Step 3 (human):** Confirm the message arrived and shows attributed to the Generalist's
  connected identity.

### Task 7: ⛔ HUMAN GATE — create the daily digest routine (Phase 3)

No files (the prompt is already versioned by Task 3). Human, in browser (~10 min).

- [ ] **Step 1:** Go to claude.ai/code/routines → New routine.
- [ ] **Step 2:** Paste the **Prompt** section of `prompts/standup-digest-routine.md` verbatim.
- [ ] **Step 3:** Create it as a **Remote** routine (not "Local", which runs on your own machine).
  Attach the **Slack** connector and give the routine commit-level repo access (clone the repo, or
  a commit-listing GitHub connector — see Task 5 Step 2). A routine includes ALL your connected
  connectors by default, so **remove any you don't need**. (Routines are in research preview and
  need Claude Code on the web enabled.)
- [ ] **Step 4:** Set the schedule: daily, 09:00, timezone Europe/London (min interval is 1 hour).
- [ ] **Step 5 (verify now, don't wait for tomorrow):** Trigger a manual run, then **open the run's
  transcript** — a green status dot only means the session started/exited; blocked calls and missing
  connector tools show up in the transcript. Expected: a digest appears in `#standup` covering the
  last 24h. If not, the transcript tells you which connector failed (usually one that was never
  authorized — tokens themselves auto-refresh).
- [ ] **Step 6 (verify tomorrow):** Confirm the 09:00 scheduled run posted. Add a recurring
  weekly 30-second glance at `#standup` (routine health check) to whoever runs standups (J).

### Task 8: ⛔ HUMAN GATE — Slack-triggered coding sessions (Phase 4)

No files. Human (~10 min).

- [ ] **Step 1:** In the Claude Slack app's settings (App home → Settings), set mention routing
  to **Code + Chat** (Claude decides intent per mention).
- [ ] **Step 2:** Each teammate who wants to trigger coding work confirms their GitHub connector
  is linked on their own claude.ai account (this is per-user, unlike Task 5).
- [ ] **Step 3 (verify):** In a channel, post a trivial-but-real task, e.g. `@Claude in the team
  repo, add a one-line "Slack integration live" note under "Recently shipped" in STATUS.md and
  open a PR.` Expected: Claude starts a Claude Code session, posts progress in the thread, and
  ends with a Create PR / session link. Review + merge (or close) the PR.

### Task 9: Announce to the team

**Files:**
- Modify: `comms/board-generalist.md` (append newest-at-top, per `comms/README.md`)

- [ ] **Step 1: Pull latest** — `git pull --rebase`. Read `comms/board-generalist.md` and find
  the highest existing `G-###` id (the worktree copy may be stale — trust post-pull `main`).
  Use the next number for the new entry.
- [ ] **Step 2: Append this entry at the top of the board** (below the header lines), replacing
  `G-0XX` with the next id and the date if executed on a different day:

```markdown
### [G-0XX] @all · INFO · OPEN · 2026-07-04
Slack + Claude is live. Action for each of you (~5 min): open the Claude app in Slack → Connect
→ sign in with YOUR Claude account. Full guide + norms: slack-setup.md. Daily digest posts to
#standup at 09:00 UK (prompt versioned at prompts/standup-digest-routine.md). comms/ boards stay
the agent bus — sunset review 2026-07-18.
```

- [ ] **Step 3: Commit**

```bash
git add comms/board-generalist.md
git commit -m "comms: announce Slack + Claude integration, per-person action"
git pull --rebase && git push
```

- [ ] **Step 4 (human): Post the Slack kickoff message** in the main working channel:

> Slack + Claude is live 🎉 — @Claude works in threads (summaries, drafts, code review), and
> coding mentions launch real Claude Code sessions with PRs. One-time setup (~5 min): open the
> Claude app in the sidebar → Connect → sign in with your Claude account. Norms + guide:
> `slack-setup.md` in the repo. Daily digest lands in #standup at 09:00.

### Task 10: Schedule the two follow-up dates

No repo files. Either party can do this; the human's calendar is fine.

- [ ] **Step 1:** Calendar entry **2026-07-18**: "Sunset review: comms/ boards vs Slack-primary
  — if boards are only written to feed the digest, retire them (update AGENTS.md + STATUS.md if
  so)."
- [ ] **Step 2:** Calendar entry **2026-08-03**: "Claude Tag transition — per-user Slack app
  setups may stop working; decide on Claude Team plan."

---

## Completion checklist

- [ ] All four teammates connected to @Claude in Slack (Task 4)
- [ ] Test digest posted to #standup from a manual routine run (Task 7 Step 5)
- [ ] A Slack-triggered Claude Code session produced a PR (Task 8 Step 3)
- [ ] `slack-setup.md` + `prompts/standup-digest-routine.md` + board entry on `main`
- [ ] Follow-up dates in the calendar (Task 10)
