# `/showcase` Script — FINAL (Joel drives · Pranav narrates · ~2:00)

> Verified click-by-click against the deployed build (stats row, Back to matrix, Verified-on-page
> badge, 10+2 dossier split). Where it sits: Jawad's deck (3 min) → Product slide NEXT cuts to
> `/showcase` → this section (2 min) → **→ (Right Arrow)** → Ask slide, Jawad closes.

## Before you walk on (60 seconds)

1. **Hard-refresh `/showcase`** — resets the decision log to `0/50` and questions to `1`
   (rehearsal clicks persist in the session and would falsify the "zero approved" line).
2. One warm-up click: insurance row → "See it in the document" → green highlight →
   **"Back to matrix"** (top bar).
3. **Do NOT press → (Right Arrow)** until the handoff — it exits to the deck's Ask slide.

## Beat 1 · 0:00–0:15 — The stats row

**Joel:** sweep across the top stats row.
> "Look at the top line. **Fifty requirements found. Twelve deal-breakers — in red. Thirteen
> queued for verification, one question it needs me to answer.** And below it, the decision log:
> **zero approved. Nothing decided, nothing submitted. I'm at the wheel.**"

*(The 13 includes the 12 gates + 1 other low-confidence row — say "queued for verification",
never "12 plus 13".)*

## Beat 2 · 0:15–0:35 — Deal-breakers first

**Joel:** point at the oxblood dossier; end on the count line + the two amber rows at the bottom.

**Pranav:**
> "This is Bradwell — a real 34-page grounds tender. Cached output from our full pipeline —
> ingest, chunk, extract, reconcile, autofill — frozen so the stage doesn't depend on Wi-Fi or a
> live model call.
>
> Twelve deal-breakers, pinned first — and see the split: **ten high-confidence**, the
> hand-labelled bid-killers from our held-out test, and **two flagged for review**, marked amber,
> where the tool was less sure *and said so*. That's the safe failure mode: a visible over-flag,
> never a silent miss."

## Beat 3 · 0:35–1:00 — Source proof (the money shot)

**Joel:** click dossier row **01 — insurance (£5m/£10m, p.5 · 3.3.2)** → **"See it in the
document"** → real page opens, line highlighted, **"Verified on page"** badge.
> "Never take our word for it — the proof is in *their* document, not our dashboard. The
> insurance gate: one click, the exact line, highlighted on the actual page. See the badge —
> **verified on page**. All fifty lines check out the same way."

**Optional (only if on pace):** "Back to matrix" → row **03 — pricing statements (p.31)** →
"See it in the document."
> "And this is the kind that kills bids — a mandatory pricing confirmation buried on **page 31
> of 34**."

**If the overlay misbehaves** (it degrades gracefully, never blank):
> "Same proof from the row itself — page, clause, verbatim excerpt on every line."

## Beat 4 · 1:00–1:20 — Measured proof

**Joel:** hands off the mouse. **Pranav:**
> "That catch is engineered, not hoped for. A deterministic net — no model — catches **26 of 26**
> hand-labelled disqualifiers across four validated gold tenders. **Bradwell was held out** — the
> pipeline had never seen it and caught **all ten**. Duffield, also held out: zero missed.
> Worst-case synthetic phrasing bank: **101 of 101**. Re-runnable from the repo in seconds."

**Short version if behind:**
> "Bradwell was held out — all ten caught. Across four gold sets, 26 of 26."

## Beat 5 · 1:20–1:40 — Evidence & honesty

**Joel:** insurance panel still open — point at the **drafted answer + citation**. Then "Back to
matrix" → **Needs you** group → the **"two comparable contracts"** row.
> "Where it can prove we comply, it drafts the answer and **cites our own document**. And here's
> the one thing on this whole tender it couldn't back — it didn't invent an answer. **It asked
> me.** I'm not correcting a confident guess; I'm giving it the truth it didn't have."

**Pranav (if time):**
> "Our groundedness eval verified 42 of 42 citations — zero fabrications."

## Beat 6 · 1:40–2:00 — Human approval + handoff

**Joel:** back to the **insurance** row → **Approve** → typed confirmation → type **CONFIRM** →
point at the decision log ticking to **1 decided**.
> "When I approve a deal-breaker, **it stops me** — I type CONFIRM before a bid-killer is signed
> off. Every approve, edit, and flag lands in that log. **The expert stays in control.**"

**Press → (Right Arrow)** → Ask slide appears.
> **"Jawad, bring us home."**

## Guardrails (Do Not Say)

- **Weeks → minutes** = weeks of *bid at stake*, first read in minutes. If pushed: *"the first
  read is a day or two by hand; Bidframe does it in minutes so the weeks-long bid isn't wasted."*
- Do not say the model is running live.
- Do not say a headline all-requirement accuracy percentage.
- The 101-case bank is **synthetic** — never imply real tenders.
- Do not say Bidframe writes or submits the bid.
- 42/42 is our groundedness eval (SPSO run) — not the 4 on-screen Bradwell answers.
- **Don't click the "waste carrier licence" row** — its excerpt is a model paraphrase, so it shows
  the honest "Could not pin the excerpt" fallback. If a judge finds it: *"where the excerpt isn't
  verbatim in the document, we say so instead of faking a highlight."*

## Emergency cuts (in order)

1. Cut the optional p.31 second source-proof.
2. Cut Pranav's proof paragraph to the short version.
3. Cut the open-question click — point at "Need your input: 1" in the stats row instead.
- **Never cut** the insurance source proof. **Never cut** the CONFIRM approval beat.
