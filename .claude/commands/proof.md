---
description: Log a YC proof point (customer, placement, milestone) — appends to yc-story.md and this week's update
argument-hint: what happened, e.g. "first paying customer — Acme Bid Consultancy, £399/mo"
---

Log this proof point: $ARGUMENTS

1. Append a dated line (`- **<today YYYY-MM-DD>** — <the proof point>`) to the
   **Proof-point log** at the bottom of `yc-story.md`. Append-only — never edit
   existing lines. Tighten the wording to one verifiable sentence; keep any
   names/numbers given.
2. If it's evidence for a claim in the **Founder receipts** table or closes an
   item in **Gaps to close**, update that row/checkbox too.
3. If this week's update file exists in `updates/`, add it under **Proof points**
   there as well.
4. If the proof has perishable evidence (a results page, a post, a listing),
   remind the human to screenshot it into the private receipts drive now.
5. Commit with `docs: proof point — <short summary>`. Do not push unless asked.
