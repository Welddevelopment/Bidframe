# `/showcase` Script - Joel and Pranav (verified against the live build)

> Live demo section only. Target: **2 minutes** scripted (optional beats stretch to ~3:00 if the slot
> allows). Surface: **`/showcase`**. Joel drives, Pranav narrates over the clicks.
>
> Every click and number below is verified against the deployed build + `bradwell-prebake.json`.
> Cached output of a real Bradwell pipeline run — do not run live upload on stage.

## Setup (what is actually on screen)

- Tab: `/showcase` — "Grounds Maintenance Tender – Bradwell Common & Heelands (Demo)"
- **Control strip (top):** Decision log **0/50** · Approved **0** · Edited **0** · Flagged **0** ·
  Questions remaining **1** · "0 approved — every line is pending your review"
- **Deal-breaker dossier:** 12 requirements · count line "**10 high-confidence · 2 flagged for
  review**" — the 10 confident gates listed first (oxblood index), the 2 lower-confidence ones
  **last, amber, with a "Needs review" badge**
- ⚠️ **Stage hazard: do NOT press → (Right Arrow)** while on `/showcase` — it exits to the deck's Ask
  slide (that's the deliberate handoff at the END). Use the mouse/j-k to move around.

## 0:00-0:15 - Control Model

**Joel action:** point at the control strip (Decision log 0/50 · 1 question remaining).

**Joel says:**
> "Before I touch anything, look at the log. Bidframe has read all 34 pages, pulled out 50
> requirements, flagged the deal-breakers, drafted answers where it had evidence, and left one
> question it couldn't answer.
>
> Zero approved. Nothing decided. Nothing submitted. I am at the wheel."

## 0:15-0:35 - Deal-Breakers First

**Joel action:** point at the oxblood dossier; end on the count line and the two amber rows at the bottom.

**Pranav says:**
> "This is Bradwell — a real 34-page grounds tender, cached output from the same ingest, chunk,
> extract, reconcile, and autofill pipeline, frozen so the stage doesn't depend on Wi-Fi or a live
> model call.
>
> Twelve deal-breakers, pinned first. See the split on screen: **ten high-confidence** — the
> hand-labelled bid-killers from our held-out test — and **two flagged for review**, marked amber,
> where the tool was less sure and said so. That's the safe failure mode: a visible over-flag,
> never a silent miss."

## 0:35-1:00 - Source Proof (the money shot)

**Joel action:** click dossier row **01 — the £5m/£10m insurance requirement (p.5 · 3.3.2)** → the
requirement panel opens → click **"See it in the document"** → the real tender page opens with the
exact line **highlighted green**.

**Joel says:**
> "Never take our word for it. The proof is in their document, not our dashboard.
>
> The insurance gate — one click, and there's the exact line, highlighted on the actual page of the
> actual tender. Every one of the 50 lines in this matrix can be checked the same way."

**Optional (if pacing is good):** close, click row **03 — the pricing-statements gate (p.31)** →
"See it in the document."
> "And this is the kind that kills bids: a mandatory pricing confirmation buried on page 31 of 34."

**If the PDF overlay misbehaves** (it degrades gracefully, never blank):
> "Same proof from the row itself — page, clause, and the verbatim excerpt are carried on every line."

## 1:00-1:25 - Measured Proof

**Joel action:** stay still. No clicking.

**Pranav says:**
> "That catch is engineered, not hoped for. A deterministic net — no model — catches **26 out of 26**
> hand-labelled disqualifiers across our four validated gold tenders. **Bradwell was held out**: the
> pipeline had never seen it and caught **all ten**. Duffield, also held out — zero missed. And a
> synthetic worst-case phrasing bank: **101 out of 101**. Anyone can re-run it from the repo in
> seconds."

**Short version if tight:**
> "Bradwell was held out and all ten labelled deal-breakers were caught. Across four validated gold
> sets the deterministic floor is 26 out of 26."

## 1:25-1:45 - Evidence And Honesty

**Joel action:** the insurance panel is already open — point at the **drafted answer + its citation**
("AcmeGrounds Ltd… £5,000,000…", cited to the capability doc). Then open the **"Needs you" group**
in the matrix and click the **"two comparable contracts" row** — the one open question.

**Joel says:**
> "Where it can prove we comply — like the insurance — it drafts the answer and cites our own
> document. And here's the one thing on this whole tender it couldn't back: it didn't invent an
> answer. It asked me.
>
> I'm not correcting a confident guess. I'm giving it the truth it didn't have."

**Pranav adds if there is time:**
> "Our groundedness eval verified 42 out of 42 citations — zero fabrications."

## 1:45-2:00 - Human Approval

**Joel action:** on a **confident** deal-breaker (e.g. the insurance row), click **Approve** → the
panel demands typed confirmation → type **CONFIRM** → approve. Point at the control strip ticking
to "1 decided by you".

**Joel says:**
> "And when I approve a deal-breaker, it stops me — I have to type CONFIRM before a bid-killer is
> signed off. Every approve, edit, and flag lands in that decision log. The expert stays in
> control."

**Handoff:** press **→ (Right Arrow)** — the screen returns to the deck's Ask slide.
> "Jawad, bring us home."

## Do Not Say

- Do not say the model is running live.
- Do not say a headline all-requirement accuracy percentage.
- Do not misdescribe the 101-case phrasing bank; call it synthetic.
- Do not say Bidframe writes or submits the bid.
- Do not imply the 42/42 citations were measured on the 4 Bradwell answers — it's our groundedness
  eval (SPSO run); "our groundedness eval" is the honest wording.
- "Weeks → minutes" = weeks of **bid work at stake**, first read in minutes. Never "we do weeks of
  work in minutes" (first read by hand is 1–2 days — see `demo-claim-ledger.md` §C2).

## Emergency Cuts (in order)

1. Cut the optional page-31 second source-proof.
2. Cut Pranav's 26/26 paragraph to the short version.
3. Cut the open-question click — point at "Questions remaining: 1" on the strip instead.
- **Never cut** the insurance source proof. **Never cut** the CONFIRM approval beat.

## Rehearsal checklist (once, before you walk on)

- [ ] Insurance row (01) → "See it in the document" → **green** highlight lands.
- [ ] p.31 pricing row (03) → highlight lands.
- [ ] "Needs you" group → the "two comparable contracts" question row opens.
- [ ] Approve on insurance → typed CONFIRM works → strip ticks to 1 decided. (Refresh `/showcase`
      afterwards to reset to 0 approved for the real run.)
- [ ] → (Right Arrow) returns to the deck's Ask slide.
