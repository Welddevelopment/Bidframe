# Pitch script — word for word (two speakers + Joel's demo)

> The spoken track for the 3-minute deck (`/pitch`) + Joel's 2-minute demo (`/showcase`), matched to
> the deck as built: 5 slides, per-slide beats (beat dots next to the counter show presses left),
> slide budgets 24 / 30 / 40 / 46 / 30s, pace ghost beside the timer. **Two deck speakers:**
> Jawad opens and closes; Pranav owns the solution and the product; Joel drives the live demo.
> Companion docs: `pitch-run-of-show.md` (clock + handoffs), `control-demo-script.md` (Joel's
> control beat), `demo-claim-ledger.md` (Q&A numbers). ~150 wpm; if the pace ghost goes amber,
> cut the bracketed lines first.

## Slide 1 — Problem · Jawad · 24s

> **On screen:** centered headline "One missed deal-breaker kills the bid".

"A public-sector tender is a hundred-plus pages of legal text. Buried inside it are pass-fail
clauses — miss a single one, and the bid is binned after weeks of work. [Finding them by hand is
days of expert reading.] This is Bidframe: the first-read layer that finds what kills a bid —
before anyone writes a word."

**NEXT → slide 2.** Jawad continues.

## Slide 2 — Use Case · Jawad · 30s, FOUR beats (~7s each)

> **Mechanic:** each NEXT lights the next register station and swaps the proof card below.

**Beat 1 — Open tender (Days → minutes + £341bn):**
"A bid manager's first read costs days of expert time — in a three-hundred-and-forty-one-billion-
pound market. Bidframe turns those days into minutes."

**NEXT. Beat 2 — Find risks (deal-breaker register):**
"First, it finds the risks — every pass-fail clause surfaces immediately, deal-breakers pinned to
the top."

**NEXT. Beat 3 — Build matrix (source trace):**
"Every requirement becomes a matrix row with its source attached — the exact page, the exact
clause."

**NEXT. Beat 4 — Draft safely (evidence-backed answer):**
"And answers draft themselves with evidence receipts. The expert stays at the wheel."

**NEXT → slide 3.** Hand to Pranav.

## Slide 3 — Solution · Pranav · 40s, TWO beats

**Beat 1 — hold on the clause page (~18s):**
"This is page seven of a real tender — grounds maintenance for a council. Clause 4.6. It looks
like every other paragraph on the page. Hidden inside it are five separate ways to lose the bid
outright. [Price disclosure. Collusion. An inducement.] A tired human on day two of reading
misses this."

**NEXT — the five disqualifiers light up and the split reveals (~22s):**
"Bidframe doesn't. Same tender, one pass: twelve deal-breakers surfaced before writing starts —
these five included — every one traceable back to its page and clause. The wall of legalese
becomes a checklist you can defend."

**NEXT → slide 4.** Pranav continues.

## Slide 4 — Product · Pranav · 46s

> **On screen:** live GatingHero tilted in front, compact matrix behind, answer receipt floating.
> **Optional flourish:** press **P** to step inside the real product; **Esc** walks back.
> (If you've clicked Source proof, click empty slide space before pressing Enter/P.)

"And this is the real product, on that same tender — not a mockup. The first screen a bid team
sees is the twelve things that can disqualify them. Click any line —" *(click Source proof)* "—
and there's the receipt: the clause, the page, the tender's own words. [Behind it, the full
compliance matrix; every draft answer carries evidence.] We built the layer you have to trust
before you'd let anything write for you. Nothing on this stage is staged — Joel, show them."

**Hand the mic to Joel. Switch to `/showcase`** (or press P and drive the in-stage portal).

## Live demo — Joel · 2:00 · `/showcase`

> Full beats in `control-demo-script.md` and `pitch-run-of-show.md`. Spoken skeleton:

1. **Deal-breakers first (0:00–0:25):** "Twelve deal-breakers, pinned before I've read a page.
   Here's the insurance clause — five million public liability, ten million employer's."
2. **Source trace (0:25–0:55):** "One click — the real PDF, the exact line highlighted. I'm not
   trusting a model; I'm reading the tender." *(open the page-31 pricing landmine)* "This one was
   buried on page thirty-one."
3. **Answer beat (0:55–1:20):** "Where it can back an answer, it drafts one — with the citation."
4. **Control beat (1:20–2:00):** *(approve a deal-breaker → named-confirm)* "It won't let me
   rubber-stamp a bid-killer — I have to sign for it." *(answer the open question)* "And where it
   couldn't back an answer, it asked me instead of guessing. Every decision lands in this tally —
   I'm at the wheel."

**Back to the deck (slide 5 is one NEXT from where Pranav left it).** Hand to Jawad.

## Slide 5 — Ask · Jawad · 30s

"The goal was never to replace the bid manager. It's to make them ten times faster while every
judgement stays theirs — captured, with receipts. [The deal-breaker catch is engineered, not
hoped for: every disqualifier across our gold tenders caught, held-out tender included, plus a
hundred-and-one worst-case phrasings.] We're Bidframe. bidframe-dot-org — invest, advise, or
introduce us. Come find us."

> **Careful:** one more NEXT on this slide cuts straight to `/showcase` — that's the post-Q&A
> escape hatch, not part of the close.

## Mechanics crib (rehearse once with R)

- **R** = rehearsal mode: autoplay at real budgets, big speaker name + countdown.
- Beat dots next to the counter = presses left on this slide. Pace ghost `+Ns` = you're behind.
- **Q** = appendix for Q&A (proof ledger, market sources, architecture). **End** = jump to Ask.
- Q&A number to keep handy: "why 12 not 10?" → "ten hard bid-killers plus two flagged for a human
  to check — recall-first, we'd rather over-flag than miss one."
