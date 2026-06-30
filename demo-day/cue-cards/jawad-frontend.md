# Cue Card — Jawad (Frontend: compliance matrix, source panel, decision controls, graph view, demo UI)

You're the **driver** for the whole run — every click happens at your hands, because it's your build and
the deploy is yours. That means your job is two things at once: narrate your own beats, *and* stay one
click ahead of everyone else's. Full timeline: [../run-sheet.md](../run-sheet.md).

## Before anyone speaks

Pre-open these tabs in order, logged in / loaded, zoom comfortable for the room:
1. `/review` (or `/upload`) — ready for the drag-drop, file picked but not yet dropped.
2. The gating row pre-identified so you can click it instantly when Bobby finishes the catch beat.
3. `/answers` open in a second tab, pre-loaded, ready to flip to.

## Your beats

### 1. CLICK-TO-SOURCE (trust) — 0:55–1:15
**Action:** click the flagged gating row the instant Bobby finishes → the source/requirement drawer
slides over. Point at the highlighted clause text and the page reference in the mono margin.

> "One click, and you see the exact sentence, on the exact page, it came from. Every line in this matrix
> is checkable — we're not asking you to trust a black box."

**Handoff:** *"And where we're genuinely not sure — we say so."* → scroll to an amber `needs_review` row
for Bobby.

### 2. AUTOFILL + GAP INTERVIEW (you drive, you open it) — 1:35–2:05
**Action:** navigate to `/answers`, approve a requirement or two live, surface a drafted answer with its
evidence citation, then scroll to the open-questions list and its progress bar.

> "Approve a requirement, and it drafts an answer straight from the bidder's own capability documents —
> every claim links back to the evidence behind it."

Then step back half a pace — that's Bobby's cue for the groundedness number. Resume once he's done:

**Handoff (after Bobby's number):** *"Three weeks down to minutes — with the human approving every step."*
→ back to Joel.

## If asked about your lane (you carry ~40% of the judged score here — own it)

- **"Why does the design look the way it does?"** → the "civic record" language: brutalist + editorial
  over warmed paper, because the product *is* an official record in progress — the form mirrors the
  function (auditability). Oxblood = gating/danger, forest = approved, the confidence bead scale is
  greyscale-safe (never relies on colour alone) so the honesty signal still reads if someone's colourblind
  or the room's projector washes it out.
- **"How does a bid manager actually stay in control?"** → every requirement has approve / edit / flag —
  nothing auto-applies. Say the words "the human approves every step" out loud if a judge asks this
  directly; it's the literal criterion they're scoring (20% of the total).
- **"What's the graph view for?"** → relationship graph over `criteria_ref` + `depends_on` — shows how
  requirements connect to award criteria and to each other, not just a flat list. Mention only if asked;
  it's deliberately not part of the core 90 seconds (guardrail: don't over-build/over-feature the graph in
  the pitch).

## Watch for

- You're holding the laptop *and* speaking twice — rehearse the physical handoffs (when to step back, when
  to step forward) as much as the words. A fumbled click during Bobby's number lands worse than a fumbled
  line.
- If Render is cold or the connection is shaky, the upload/answers calls can lag — see
  [../backup-plan.md](../backup-plan.md) for the exact fallback so you're not improvising live.
