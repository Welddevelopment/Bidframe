# Before/After beat — enhancement build spec (owner: @frontend / Jawad)

> **Status: the before/after already exists — this is a polish/authenticity pass, not a build-from-scratch.**
> The Conduct rubric scores **"The demo" at 20%** partly on *"a clear, live before/after a non-engineer
> grasps in 90 seconds."* We already have one. This ticket makes it hit harder for today's demo.
> Original design intent + full narration live in the repo-root [`pitch-before-after.md`](../pitch-before-after.md).

---

## What already exists (do NOT rebuild)

The **Solution slide** (`STOPSIGN_INDEX`, index 2) in
[`frontend/src/components/pitch/PitchDeck.tsx`](../frontend/src/components/pitch/PitchDeck.tsx) **L785–847**
is already a two-beat before/after:

- **Before panel** (`.pitch-before-after__panel--before`): renders `<TenderPageFacsimile highlighted={beat > 0} />`
  — a **TSX facsimile** of Bradwell page 7, clause 4.6 "Rejection of Tender", whose **5 buried rejection
  sub-clauses light oxblood** when the beat flips. Component:
  [`frontend/src/components/pitch/TenderPageFacsimile.tsx`](../frontend/src/components/pitch/TenderPageFacsimile.tsx)
  (per-clause stagger `180 + i*160ms`, L54). Label: "The tender. 34 pages."
- **After panel** (`.pitch-before-after__panel--after`, `aria-hidden` until `beat>0`): "Bidframe. Deal-breakers
  first.", a `{dealBreakers.length}` count, and `splitDealBreakers.slice(0,5)` rows (each `req.text` +
  `p.{source_page} · {source_clause}`).
- **Beat mechanic** (reuse this, don't reinvent): `beat` state at L283; advanced in `next()` **L334–349**
  (first NEXT on the Solution slide flips `beat` 0→1 and does *not* advance; second NEXT resets + moves on);
  reversed in `previous()` L351–362; autoplay auto-fires the reveal at **L611–617** (~18s into the 40s budget);
  persisted + restored so it's **refresh-safe** (L514–519, `PITCH_STATE_KEY` is already `v2`).

## The gap

The two **real scanned tender pages** are staged but **orphaned** —
[`frontend/public/pitch/before-tender-p7.png`](../frontend/public/pitch/before-tender-p7.png) (clause 4.6, the
5 disqualifiers) and [`-p31.png`](../frontend/public/pitch/before-tender-p31.png) (the buried pricing landmine).
A CSS class **`.pitch-before-after__image`** was written for them at `frontend/src/app/globals.css`
**L4146–4160** (`object-fit: cover`, brightness filter) but **is never used**. A real page reads as more
visceral/authentic than a facsimile — that's the upside here.

## Enhancement options (your call, ranked by impact-for-effort)

1. **Swap in / back the real page (recommended, ~30 min).** Put `before-tender-p7.png` into the before-panel
   via the ready `.pitch-before-after__image` class — either replacing the facsimile, or behind it so the
   facsimile's oxblood highlights overlay the real page. A real scanned tender is the "I feel the pain"
   frame; keep it slightly darkened (the filter's already there) so the highlights pop on reveal.
2. **Scan sweep on reveal (~20 min).** Reuse the existing **`.wall-scan`** keyframe (`globals.css` L563–570,
   a thin bar sweeping `translateY -100%→520%`) as the "Bidframe reading it" pass over the before-panel the
   moment `beat` flips — *then* the clauses light. This is the "scan → highlight in place" money frame.
3. **p.31 landmine as a second beat (optional).** Use `before-tender-p31.png` (buried pricing statement) to
   reinforce "a bid-killer 31 pages deep." If you add a beat, generalize `beat` from 0/1 to 0..N and extend
   the guards at L336 / L353 and the autoplay timing at L611–617 — see the "cost" note below.

## Reuse, don't rebuild
- The **`beat` two-beat idiom** (above) — keep it a **beat on the existing Solution slide**.
- **`.wall-scan`** scan bar, **`Reveal`** (`frontend/src/components/landing/Reveal.tsx`), the facsimile's
  staggered highlight, and `.pitch-before-after__image` — all already in the codebase.

## ⚠️ Do NOT add a new slide
The deck is index-sensitive. A new slide forces changes to **all** of: `MAIN_SLIDE_COUNT` (L42),
`STOPSIGN_INDEX` (L46), `PRODUCT_INDEX` (L48), `AUTOPLAY_SECONDS` (L50), the number-key jump range `1`–`5`
(L472), the appendix `tick={activeIndex === 6}` refs (L1058/1064/1070/1076), and a `v2`→`v3` bump of
`PITCH_STATE_KEY` (L56). Keep the enhancement **inside the existing Solution slide's beat** to avoid all of it.

## On-screen copy (paste-ready, from `pitch-before-after.md` §4)
- **Before kicker:** `One clause. Five ways to lose the bid. None of them obvious.`
- **Contrast headline:** `Days of expert reading, one miss = a binned bid  →  minutes, every deal-breaker caught, every line traceable.`
- **After label:** `Bidframe. Deal-breakers first. Every line back to its clause.`

## Narration (~90s, `pitch-before-after.md` §5)
- **BEFORE:** "This is a real 34-page grounds tender. Look at clause 4.6 — 'Rejection of Tender.' Buried in
  that one paragraph are five separate ways to get your bid thrown out… and that's *one* clause."
- **REVEAL:** "Bidframe reads the whole pack, finds every one of them, and shows you exactly where each came
  from." *(scan → highlights on the page → lift into matrix)*
- **AFTER:** "The deal-breakers first, twelve of them, each traced to its clause and page…"

## Definition of done
- Keyboard nav: the reveal is **one keypress**, and going backward returns to the pre-reveal state (the beat
  mechanic already does this — preserve it).
- `prefers-reduced-motion`: **hard-cut** (before-with-highlights → after), skip the scan animation.
- **Refresh-safe:** the beat is persisted — don't break that.
- Projector-legible; prints/exports to a sensible **static split** for the PDF leave-behind.
- Checked once in a real browser at projector dimensions.
