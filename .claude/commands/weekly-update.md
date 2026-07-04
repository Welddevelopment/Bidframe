---
description: Draft this week's founder update from git history, comms, and STATUS — you only fill in "Learned" and confirm the number
---

Draft this week's founder update. Do the work — the human should only have to
confirm, not assemble.

1. **Find the window.** List `updates/` (ignore `TEMPLATE.md`); the newest dated
   file is the last update. The window is from that date to today. If today's
   update already exists, switch to updating it in place.
2. **Gather, don't ask.** Within the window:
   - `git log --oneline --since=<last-update-date>` on the current branch (and
     `origin/main` if it differs) → candidate "Shipped" bullets. Summarize by
     theme, not one bullet per commit.
   - Read `STATUS.md` and all four `comms/board-*.md` boards → any `BLOCKER`
     still `OPEN` goes in "Stuck"; any `DECISION` is a candidate proof point or
     "Learned".
   - Read `yc-story.md` → note which "Gaps to close" checkboxes are still open.
3. **Draft** `updates/<today YYYY-MM-DD>.md` from `updates/TEMPLATE.md`, prefilled
   with everything gathered. For **The one number**: use paying customers unless
   the latest updates show a different driving metric; carry forward last week's
   value and compute the delta if derivable, otherwise mark it `<confirm>`.
4. **Ask the human exactly two things** (one message): the "Learned" entry, and
   confirmation/correction of the one number. Everything else they can edit after.
5. **Route proof points.** Anything in "Proof points" also gets a dated line
   appended to the Proof-point log in `yc-story.md` (append-only, never rewrite
   old lines).
6. **Nudge the gaps.** End your reply with any still-unchecked items from
   `yc-story.md` "Gaps to close" — one line each, so they stay visible weekly.
7. **Commit** the update (and `yc-story.md` if touched) with message
   `docs: founder update <date>`. Do not push unless asked.
