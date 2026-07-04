# `/showcase` Script - Joel and Pranav

> Live demo section only. Target: **2 minutes**. Surface: **`/showcase`**.
> Joel/Joe drives the laptop. Pranav narrates over the clicks.
>
> Goal: show control, source proof, measured deal-breaker catch, evidence-backed answer, and open
> question. Do not run live upload on stage. This is cached output of a real Bradwell pipeline run.

## Setup

- Tab: `/showcase`
- Tender: Bradwell grounds maintenance, 34 pages
- State: frozen Bradwell run, 12 visible deal-breakers, 0 approved
- Driver: Joel/Joe
- Narrator: Pranav

## 0:00-0:15 - Control Model

**Joel/Joe action:** point at the ControlPanel strip.

**Joel/Joe says:**
> "Before I touch anything, notice what Bidframe has and has not done. It has read the tender, found the
> requirements, flagged the deal-breakers, drafted where it had evidence, and left gaps for review.
>
> Zero approved. Nothing decided. Nothing submitted. I am at the wheel."

## 0:15-0:35 - Deal-Breakers First

**Joel/Joe action:** scroll or point to the oxblood deal-breaker wall.

**Pranav says:**
> "This is Bradwell, a real 34-page grounds-maintenance tender. This is cached output from the same
> ingest, chunk, extract, reconcile, and autofill pipeline, frozen so the stage demo does not depend on
> Wi-Fi or a live model call.
>
> Twelve deal-breakers are pinned at the top. Ten are the hand-labelled bid-killers from our held-out
> Bradwell test. The other two are lower-confidence review flags. That is the safe failure mode:
> visible over-flag, never silent miss."

## 0:35-1:00 - Source Proof

**Joel/Joe action:** open the insurance requirement, then click the source proof / document proof.

**Joel/Joe says:**
> "Never take our word for it. The proof is in their document, not our dashboard.
>
> Here is the insurance requirement. Here is the exact page, clause, and source line. This is what makes
> the matrix usable in a real bid review: every claim can be checked."

**If rehearsed and visible:** open or point to the page-31 pricing landmine.

**Joel/Joe optional line:**
> "And this one is the kind of thing people miss: a pricing landmine buried on page 31."

**If the PDF overlay misbehaves:**
> "Same point from the row itself: page, clause, and verbatim excerpt are all carried through. We are
> still checking against the buyer's document."

## 1:00-1:25 - Measured Proof

**Joel/Joe action:** stay on the matrix or source proof. Do not click around.

**Pranav says:**
> "The deal-breaker catch is engineered, not hoped for. Across SPSO and museum, the deterministic net
> catches 12 out of 12 deal-breakers without the model.
>
> Across all four validated gold sets, it catches 26 out of 26 hand-labelled disqualifiers. Bradwell was
> held out: the pipeline had never seen it, and it caught all ten. Duffield was also held out, with zero
> deal-breakers missed. And the worst-case phrasing bank is synthetic: 101 out of 101."

**If time is tight, use only this:**
> "Bradwell was held out and all ten labelled deal-breakers were caught. Across four validated gold
> sets, the deterministic deal-breaker floor is 26 out of 26."

## 1:25-1:45 - Evidence And Honesty

**Joel/Joe action:** show the evidence-backed answer on the insurance row, then the open question row.

**Joel/Joe says:**
> "Where Bidframe can draft from evidence, it cites that evidence. Where it cannot prove an answer, it
> does not invent one. It asks.
>
> That is the trust line: I am not correcting a confident guess. I am giving it the truth it did not have."

**Pranav adds if there is time:**
> "Our groundedness eval verified 42 out of 42 citations, with zero fabrications."

## 1:45-2:00 - Human Approval

**Joel/Joe action:** approve a deal-breaker with `CONFIRM` if rehearsed. If not rehearsed, point to the
control contract and decision tally.

**Joel/Joe says:**
> "If I approve a deal-breaker, it stops me. I have to explicitly confirm before a bid-killer is signed
> off. I can edit a draft, flag a row, or answer the gap myself.
>
> Every decision is captured. The expert stays in control."

**Hand back to Jawad:**
> "Jawad, bring us home."

## Do Not Say

- Do not say the model is running live.
- Do not say a headline all-requirement accuracy percentage.
- Do not misdescribe the 101-case phrasing bank; call it synthetic.
- Do not say Bidframe writes or submits the bid.

## Emergency Cuts

- Cut the optional page-31 line first.
- Cut the full 26/26 proof into the short version.
- Never cut source proof.
- Never cut the human approval/control beat.
