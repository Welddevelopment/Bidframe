# 5-minute run-of-show — the 1pm live pitch

> The timed spine that ties it all together. The word-for-word track is `pitch-script.md`; detailed
> beats live in `control-demo-script.md` (the control moment), `pitch-before-after.md` (the
> before/after), and `demo-claim-ledger.md` (Q&A numbers). This is the clock + the handoffs. Target
> **5:00**: a **3-minute, 5-slide deck with two speakers** (Jawad opens and closes; Pranav owns
> Solution + Product) followed by **Joel's 2-minute live demo** on **`/showcase`**, then Jawad closes
> on the deck's Ask slide. One handoff inside the deck, one to Joel, one back. The deck's built-in
> pace ghost (next to the timer) tracks the rehearsed slide budgets:
> 24s / 30s / 40s / 46s / 30s — 170s with 10s of handoff slack.

## The clock

| Time | Who | Where | Beat |
|---|---|---|---|
| **0:00–0:24** | Jawad | Deck s1 (Problem) | **Hook.** "A public-sector tender is 100+ pages of legal text. Hidden in it are pass/fail rules that disqualify a bid outright — miss one after days of work and the whole bid is binned." |
| **0:24–0:54** | Jawad | Deck s2 (Use Case) | **The wedge, four beats.** Each NEXT lights a register station and swaps the proof below: Days→minutes + £341bn, then deal-breaker register, source trace, evidence-backed answer. "The work everyone struggles with is the *first read* — before you write a word." |
| **0:54–1:34** | Pranav | Deck s3 (Solution) | **Before/after, two beats.** Hold on the typeset clause 4.6 page — dense, easy to miss. NEXT marks the five buried disqualifiers and splits to the Bidframe deal-breaker view. *"A human can't see them; Bidframe pulls each one out."* |
| **1:34–2:20** | Pranav | Deck s4 (Product) | **Product proof.** GatingHero + one click on Source proof (the receipt). Optional flourish: press **Enter/P** to step *inside* the real product without leaving the stage, **Esc** back. The handoff chip reads "next · Joel — live demo". |
| **2:20–4:20** | Joel | **`/showcase`** | **The 2-minute live walkthrough.** Deal-breakers first (12, pinned) → insurance £5m/£10m → source trace (exact clause + page, one click into the real PDF) → the page-31 pricing landmine → the answer beat (evidence-backed draft with a citation) → the **control beat** (`control-demo-script.md`): named-confirm on a deal-breaker + answering the open question. Point at the ControlPanel tally: *"every decision captured — I'm at the wheel."* |
| **4:20–5:00** | Jawad | Deck s5 (Ask) | **Close on the thesis + ask.** "The goal isn't to replace the bid manager — it's to make them 10× faster while they stay at the wheel, with every decision captured as context that compounds. That's Bidframe." → `bidframe.org`. |

## Non-negotiables (rehearse these)
- **Rehearse with the deck's rehearsal mode** — press **R**: autoplay at the real budgets with a big
  speaker-name + countdown HUD. The pace ghost (`+Ns` next to the timer) shows live drift on stage.
- **Show control, don't narrate it** — the named-confirm and the open-question are the 20% "user in control" criterion made visible. Do them live.
- **Everything is on `/showcase` (frozen Bradwell) — nothing live on stage.** No uploads, no API. PDF-highlight works (Bradwell PDF is served). The deck's in-stage portal (Enter/P on the Product slide) uses the same frozen run.
- **Hit the before/after** — it's an explicit 20% demo criterion. It is now typeset TSX, not a screenshot: crisp on any projector.
- **The 12th deal-breaker line** if asked "why 12 not 10": *"ten hard bid-killers plus two it flagged for a human to check — recall-first, we'd rather over-flag than miss one."*
- **Timing:** proof numbers now live in the appendix (press **Q** for field notes; Architecture is the last one). If a judge asks "how do you know it works?", jump there — don't spend main-deck time on it.

## Fallbacks
- Browser/animation issue → PDF export of the deck + the static before/after split (`pitch-before-after.md`).
- If `/showcase` misbehaves → the deck's portal (P on the Product slide) shows the same frozen MatrixView in-stage; `/demo` (the guided version) is the second backup.
- Claim ledger (`demo-claim-ledger.md`) open in a tab for Q&A; two market figures verified before stage.
