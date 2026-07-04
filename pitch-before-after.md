# Before / After beat — spec + design direction (build owner: @frontend / Jawad)

> **Why this exists.** The Conduct rubric scores **"The demo" at 20%** on: *"a clear, live before/after that
> a non-engineer can grasp in 90 seconds."* Right now the deck shows a beautiful **after** (the matrix) but no
> **before**. This adds the before and the transition into the after. J (me) has done all the content, copy,
> narration, asset prep, and design direction below — **Jawad owns the visual build + delivery tomorrow.**
> Everything you need is here; nothing is left as "figure it out."

---

## 1. The idea in one line
Show the raw tender (a wall of legalese where the deal-breakers are invisible) → Bidframe finds them *in the
document* → they lift out into the clean matrix. Chaos → clarity, in ~90 seconds.

## 2. The "before" asset — ready in the repo
- **`frontend/public/pitch/before-tender-p7.png`** (1241×1754) — **use this.** It's page 7 of the real
  Bradwell tender: clause **4.6 "Rejection of Tender"**, sub-clauses (a)–(g). Buried in that one dense block
  are **five separate disqualifiers** — price-fixing, bribery, canvassing a councillor, an unsigned Form of
  Tender, withholding information. It's the perfect "before": a non-engineer looks at it and immediately feels
  the pain (you can't find anything), and every highlight we then reveal maps to a real deal-breaker in the
  matrix. Authentic (real public tender), not a mockup.
- Alt: `before-tender-p31.png` (the buried pricing-statement page) if you want a second beat.
- You can use the PNG as-is, or restyle/recapture in your own grade — your call. If you restyle, keep it
  legibly a *dense legal document*; the power is that the eye can't find the bid-killers.

## 3. Visual design direction

**Where it slots:** the transition from the **Problem** beat into the **Product/matrix** beat. It *is* the
solution reveal — it earns the matrix. (It can lead straight into the existing stop-sign card, or replace that
card's cold-open with this.)

**Recommended execution — the "scan & lift" reveal (reuses your scan animation):**
1. **Full-bleed raw page.** `before-tender-p7.png` fills the stage, slightly darkened + a soft vignette so it
   reads as heavy / buried. Kicker over it (top-left, your field-note type): **"One clause. Five ways to lose
   the bid. None of them obvious."**
2. **Scan.** Your existing scan-line sweeps top→bottom over the page (~2–3s). This is "Bidframe reading it."
3. **Highlight in place.** As the scan passes each disqualifying sub-clause, that line lights in the **oxblood
   blaze** (same danger colour as the stop-sign) — 4–5 highlights appear *on the real document*. This is the
   money frame: it proves it found them **in the source**, not guessed. Hold ~1s so the room sees the
   highlights sitting in dense text they'd never have spotted.
4. **Lift & reassemble.** The highlighted lines detach and animate up/right (carry your warm "walked-path"
   glow as they move), reassembling as clean deal-breaker rows at the top of the matrix.
5. **Land on the matrix** (already built), deal-breakers pinned first.

Total motion ~8–12s; the narration (below) runs over it. Respect `prefers-reduced-motion`: skip the animation
and hard-cut **raw page (with highlights already shown) → matrix**; the before/after still reads.

**Reliable fallback if the animation is risky — the split.** One static slide: **left half** = the raw p7 page
(dense, dark); **right half** = the matrix (deal-breakers surfaced). Vertical hairline divider in your palette.
Left label **"The tender. 34 pages."**, right label **"Bidframe. Deal-breakers first."** This satisfies the
rubric on its own; ship the split if the reveal won't be solid by morning.

**Colour / type (your system):** oxblood blaze for the highlights (danger = deal-breaker, consistent with the
stop sign); warm glow on the lift; keep the raw page desaturated so the blaze pops; field-note kickers +
small-caps labels; one italic-serif accent on the contrast headline (§4) if it sharpens it.

## 4. Exact on-screen copy (paste-ready)
- **Before kicker (over the raw page):** `One clause. Five ways to lose the bid. None of them obvious.`
- **The contrast headline (the before→after line — put it on the transition or under the matrix):**
  `1–2 days of expert reading, one miss = a binned bid  →  minutes, every deal-breaker caught, every line traceable.`
- **After label (over/under the matrix):** `Bidframe. Deal-breakers first. Every line back to its clause.`

## 5. Exact narration (word-for-word, timed ~90s — this is the demo criterion clock)
**BEFORE (0:00–0:18):**
> "This is a real 34-page grounds tender. Look at clause 4.6 — 'Rejection of Tender.' Buried in that one
> paragraph are five separate ways to get your bid thrown out: price-fixing, bribery, canvassing a councillor,
> not signing the Form of Tender, leaving out information. And that's *one* clause. A bid manager reads all 34
> pages by hand, for a day or more, hunting for these — and missing a single one bins the whole bid."

**REVEAL (0:18–0:30):**
> "Bidframe reads the whole pack, finds every one of them, and shows you exactly where each came from." *(scan
> → highlights on the page → lift into matrix)*

**AFTER (0:30–1:20):**
> "Here's the result — the deal-breakers first, twelve of them, each traced to its clause and page. *(click the
> insurance row)* Where we can prove we meet it — the £10m insurance — it drafts the answer and cites our
> certificate. *(click the references row)* Where it can't, it doesn't guess. It asks, and flags it for a
> human. A day's work, done in minutes — nothing missed, and you stay at the wheel the whole way."

**(hand to deck ~1:20–1:30)**

## 6. Definition of done (your standard — restated for this beat)
- Works with keyboard nav; the reveal is one keypress, and going backward returns to the pre-reveal state.
- Respects reduced-motion (hard-cut fallback above).
- Prints/exports to a sensible static state — the **split** version, or the final matrix, for the PDF leave-behind.
- Survives refresh (persist which side of the reveal you're on, like the stop-sign beat).
- Checked once in a browser at projector dimensions.

---

## 7. The other rubric touches (copy drops — same "do the work" principle)
Small, paste-ready lines so all four criteria are *named*, not just implied.

- **Impact & speed-up (30%) — the hard number (researched, sourced in `incumbent-pricing-research.md`):**
  `An outsourced tender review starts at £950; a full bid averages ~£4,000 and takes 2–8 weeks — all wasted
  if one deal-breaker is missed. Bidframe does the first read in minutes, so a small firm gets that safety net
  without a £35–50k-a-year bid writer.` Fallback one-liner: *"£400–£950 saved per tender on the first read —
  but the real number is not wasting a £4,000, multi-week bid on a rule you missed."*
- **User stays in control (20%) — SHOW it, don't just say it.** In the after walkthrough, explicitly surface
  the **open-question row**, the **needs-review flags**, and the **approve / edit / flag** controls. That
  criterion is 20% and it's our strongest fit — make it visible on screen.
- **Technical execution (35%) — "not a wrapper around a prompt."** One line in the tech beat:
  `Two-stage engine: a deterministic, recall-first net guarantees the deal-breaker floor, then a model pass
  removes false flags — validated on held-out unseen tenders (10/10) and a 101-case adversarial phrasing bank.`
  Have the eval appendix (in `demo-claim-ledger.md`) ready for "how do you know it works?"
- **Credible scale story (they explicitly ask for it).** One line, e.g. on the scale/ask slide:
  `Holds up bigger and messier: the deterministic net is a reliability floor that never silently drops a
  disqualifier no matter how long the document; extraction runs in parallel across chunks; and it generalised
  to sectors it had never seen. Nothing is trusted to the AI blindly — which is exactly what scales in an
  enterprise.`

Claim sources for all numbers: `demo-claim-ledger.md` (§B). Deal-breaker list + fixtures: `bradwell-prebake.json`.
