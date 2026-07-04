# Pitch Script - Bidframe (spoken, judge-facing)

> **Canonical script for Demo Day, 4 July 2026.** This reflects the latest role split from
> `comms/board-j.md` J-089: **Bobby + Jawad own the deck** and **Joel + Pranav own the live
> `/showcase` demo**. Bradwell is the hero tender. `/showcase` is the primary product surface.
> `/demo` is backup/cinematic proof only. Numbers must come from `demo-claim-ledger.md`.
>
> Target: **5 minutes total**. Deck: about 3 minutes. Live demo: about 2 minutes. If you need to cut,
> cut detail, not the source proof or the control beat.

---

## Guardrails

- Say **"cached output of a real pipeline run"**, never imply a live API/model call.
- Say **"pilots"** or **"design partners"**, never imply signed users.
- Say **"101 out of 101 on a synthetic phrasing bank"**, never imply those are real tenders.
- Do not use accuracy superlatives or a headline all-requirement recall/precision number.
- If challenged on a number: "Every claim on this stage is in our claim ledger with its source. Happy to walk any of them after."

## Exact Opener - Jawad, Slide 1, Problem, 0:00-0:25

> "Last year, UK public procurement was worth hundreds of billions of pounds. For the teams bidding
> into it, the stupidest way to lose is also one of the most common: a mandatory requirement buried
> deep in the tender gets missed. Weeks of expert work, and the bid is thrown out unread.
>
> Bidframe exists so that never happens quietly."

NEXT.

> "This is the first read of a tender, turned into a controlled review workflow."

## Use Case - Bobby, Slide 2, 0:25-0:55

> "Before a bid manager writes a word, they have to turn a long legal pack into a risk register:
> mandatory rules, pass/fail clauses, evidence gaps, source references.
>
> Today that is slow, manual work. Bidframe reads first. It does not replace the bid manager; it gives
> them the checklist they need to stay in control."

NEXT through the slide beats:

> "Deal-breakers first. Every row back to source. Drafts only where there is evidence. Questions where
> evidence is missing."

## Solution / Before-After - Jawad, Slide 3, 0:55-1:25

> "Here is the before: a real Bradwell grounds-maintenance tender. Clause after clause, all in the
> same legal voice. One section can hide insurance thresholds, automatic disqualification, collusion,
> missing-form rules, and a pricing landmine on page 31.
>
> The after is the important part: Bidframe lifts those bid-killers into a matrix before writing starts.
> It is not a summary you have to trust. It is a marked trail through the document."

Pause after the catch lands. Let the room read the marked clauses.

## Product / Control Frame - Bobby, Slide 4, 1:25-1:55

> "This is the product on the same tender. Deal-breakers sit at the top, in oxblood. The rows carry
> their page, clause, confidence, source excerpt, answer state, and review status.
>
> The human stays at the wheel: approve, edit, flag, or answer the open question. Nothing is submitted.
> Nothing is hidden. Every decision becomes part of the audit trail."

Hand to Joel:

> "Joel, show them the control surface."

## Live Demo - Joel + Pranav, `/showcase`, 1:55-3:55

### Beat 1 - Joel, Control Model, 1:55-2:10

Screen: `/showcase`, point at the ControlPanel strip.

> "Before I touch anything, notice what the tool has and has not done. It read the tender, found the
> requirements, flagged the deal-breakers, drafted answers where it had evidence, and left gaps for me.
>
> Zero approved. Nothing decided. Nothing submitted. I am at the wheel."

### Beat 2 - Pranav, The Catch, 2:10-2:30

Screen: Bradwell deal-breaker wall.

> "This is the Bradwell tender: 34 pages, cached output from the real ingest, chunk, extract, reconcile,
> and autofill pipeline. Twelve deal-breakers are pinned at the top.
>
> Ten are the hand-labelled bid-killers from our held-out Bradwell test. The other two are lower-confidence
> review flags. That is the failure mode we want: over-flag visibly, never silently miss the thing that kills a bid."

### Beat 3 - Joel, Source Proof, 2:30-2:55

Screen: open the insurance gate, then source proof / PDF highlight. If the PDF proof button is unavailable,
point to the page and excerpt in the row and say the same line without pretending the overlay is present.

> "Never take our word for it. The proof is in their document, not our dashboard.
>
> Here is the insurance requirement. Here is the exact page and clause. This is what makes it usable in
> a real review: every line can be checked."

If rehearsed, briefly show the page-31 pricing landmine:

> "And this one was buried on page 31. That is the kind of line people miss when they are tired."

### Beat 4 - Pranav, Numbers, 2:55-3:20

Screen: stay on the matrix or source proof.

> "The deal-breaker catch is engineered, not hoped for. Across SPSO and museum, our deterministic net
> catches 12 out of 12 deal-breakers without the model. Across all four validated gold sets, it catches
> 26 out of 26 hand-labelled disqualifiers.
>
> Bradwell was held out: the pipeline had never seen it, and it caught all ten. Duffield was also held
> out, with zero deal-breakers missed. And our worst-case synthetic phrasing bank is 101 out of 101."

Optional if time remains:

> "We do not headline all-requirement accuracy yet. The strong, validated claim is the one a bid cannot
> afford to miss: deal-breakers."

### Beat 5 - Joel, Evidence + Open Question, 3:20-3:40

Screen: show the evidence-backed answer, then the open question row.

> "Where Bidframe can draft from evidence, it cites that evidence. Where it cannot, it does not invent.
> It asks.
>
> Our groundedness eval verified 42 out of 42 citations, zero fabrications. The product's job is to make
> the bid manager faster without making them less careful."

### Beat 6 - Joel, Control Beat, 3:40-3:55

Screen: approve a deal-breaker with CONFIRM if rehearsed; otherwise point to the control contract and tally.

> "If I approve a deal-breaker, it stops me. I have to explicitly confirm before a bid-killer is signed off.
> I can edit a draft, flag a row, or answer the gap myself.
>
> Every decision is captured. The expert stays in control."

Hand back:

> "Jawad, bring us home."

## Competitors / Differentiation - Bobby or Jawad, Slide 5, 3:55-4:25

> "This is why Bidframe is not just another PDF chatbot. A chatbot summarizes. Bidframe measures,
> traces, and controls.
>
> Incumbent bid tools help write or manage responses, but they are expensive, demo-gated, and usually
> do not prove the first-read risk. NotebookLM can talk about a PDF, but it does not give you a
> source-linked compliance matrix, a deterministic deal-breaker floor, or an auditable decision record."

Keep this slide short. If time is tight, use only:

> "The wedge is measured trust: source-linked requirements, deterministic deal-breaker catch, and a
> human approval trail."

## Ask + Exact Closer - Jawad, Final Slide, 4:25-5:00

> "Conduct's thesis is that legacy moves when the context of expert decisions moves with the work.
> That is exactly what Bidframe captures: every approve, every edit, every flag, every gap answer, every
> evidence link.
>
> The matrix is the surface. The decision record is the moat."

Ask:

> "We are looking for pilot SMEs and design partners. Bring us a public-sector tender; we will have the
> deal-breaker checklist ready before the call. bidframe.org."

Final two sentences, verbatim:

> **"Weeks of expert reading, a disqualifier risk, and a blank page - down to minutes, with the killer
> requirement caught, every line checkable against the document, and a human approving every step.
> We did not build an AI that writes bids; we built the layer that makes it safe to use one."**

---

## 90-Second Collapse Version

Jawad:
> "A tender can be 100 pages of legal text. Miss one mandatory requirement and the bid is thrown out.
> Bidframe turns that first read into a source-linked checklist."

Joel opens `/showcase`:
> "This is Bradwell, cached output of a real pipeline run. Twelve deal-breakers are pinned before I read
> a page."

Pranav:
> "Bradwell was held out: ten out of ten labelled deal-breakers caught. Across four validated gold sets:
> 26 out of 26 hand-labelled disqualifiers. And the 101-case phrasing bank is synthetic, worst-case, and
> all caught."

Joel:
> "Here is the source proof. Here is an evidence-backed answer. Here is where it asks instead of guessing.
> And when I approve a bid-killer, I have to confirm. The AI proposes; the bid manager decides."

Jawad:
> "We did not build an AI that writes bids. We built the control layer that makes it safe to use one."

## Q&A Pocket

**Why 12 on screen but 10/10 spoken?**
> "Ten are the hand-labelled Bradwell bid-killers, all caught. The other two are lower-confidence review
> flags. That is the safe failure mode: a visible over-flag, not a silent miss."

**Is this just ChatGPT on a PDF?**
> "No. It is a pipeline: ingest, chunk, extract, classify, reconcile, deterministic deal-breaker net,
> source proof, evidence-grounded drafting, persistence, tests, and an eval harness. It is a trust layer,
> not a PDF chatbot."

**Is the demo live?**
> "It is cached output of a real pipeline run, frozen so stage conditions do not affect the result. Same
> schema, same product surface, no live upload risk."

**What about hallucination?**
> "Where it has evidence, it cites it. Where it does not, it asks. Our eval verified 42 out of 42 citations
> and zero fabrications."

## Delivery Notes

- First 15 seconds must land the missed mandatory requirement problem.
- The two moments that must land are the **source proof** and the **control beat**.
- Keep the competitor slide short unless the room is clearly with you.
- Do not open `/answers` on stage.
- Do not click rows on `/demo`; it is read-only. Use `/showcase` for live control.
- If `/showcase` misbehaves, switch to `/demo` and say: "Same frozen Bradwell run, guided version."
