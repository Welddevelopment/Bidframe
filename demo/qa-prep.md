# Q&A drill sheet — Bidframe, Conduct demo day

> The judged demo is 5 min; Q&A is where content gets stress-tested. Drill these until each answer is
> **one breath**. Numbers are locked in [`../demo-claim-ledger.md`](../demo-claim-ledger.md); the
> deal-breaker floor is reproducible via `python -m engine.scripts.net_floor` (26/26, no key).
> Rule under pressure: **cite the deal-breaker catch, never a headline overall accuracy %.**
> For the fuller **role-routed** version (who owns each answer + engineering depth), see
> [`../demo-day/qa-prep.md`](../demo-day/qa-prep.md).

---

### 1. "How do you know it works?"
The strongest validated claim is **deal-breaker catch**. A deterministic net — no model — flags **26/26
hand-labelled disqualifiers across four validated gold tenders, two of them held out** (Bradwell 10/10,
Duffield 4/4). You can re-run it in seconds: `python -m engine.scripts.net_floor`. Broader all-requirement
recall is promising but small-sample, so we don't headline a single accuracy number — and we say so.
**Don't say:** "100% accurate", "never misses anything."

### 2. "Isn't this just a prompt wrapper?"
No — it's a **two-stage engine**. A deterministic disqualifier net (regex over pass/fail language) sets a
recall floor that *cannot* silently drop a gate, then the model pass removes false flags. Around it: PDF
ingest with OCR fallback, chunking, extraction, conservative reconcile/dedupe, source-rectangle grounding,
evidence-checked answer drafting, a groundedness detector, persistence, and a deterministic eval harness.
The net floor is the part a wrapper can't fake.

### 3. "What happens when the AI is wrong?"
The human reviews every row. **Deal-breakers require explicit `CONFIRM` before sign-off** — the agent never
rubber-stamps one. Low-confidence rows are visibly flagged `needs_review`. Where evidence is missing it
raises an **open question instead of inventing an answer**. Failure mode is over-flagging, never a silent miss.

### 4. "Can it handle messy / scanned PDFs?"
Yes, within bounded cost: multiple PDF parsers, table recovery, sparse-page detection, **vision OCR fallback**,
chunk retries, graceful failure. Fully-scanned tenders past the cap are **flagged, not silently dropped**.
We stress-tested the 7 ugliest real tenders (incl. a 66pp/472-req NHS pack) end-to-end — no crashes.

### 5. "Why public-sector tenders, and why now?"
Because the **deal-breaker taxonomy is finite enough to make reliability measurable** — that's why we can
guarantee the catch. Timing: the **Procurement Act 2023 went live 24 Feb 2025**; UK public procurement is
**~£341bn/yr (2023/24), about a third of public spend**. A slow, high-stakes, newly-changed legacy process —
exactly the Conduct "Make Legacy Move" brief.

### 6. "Who's your user — isn't this just an SME tool?"
It's the **controlled first-read layer for bid & compliance teams handling large tender packs**. We start
with **underserved SMEs** — a full-time bid writer is £35–50k/yr they can't justify — but the same control
layer is what enterprise bid teams need. Beachhead, not ceiling.

### 7. "What's the moat? Why can't AutogenAI / incumbents do this?"
Incumbents **write bids** for big firms at enterprise prices — they start *after* the first read. We own the
**source-checkable first-read + deal-breaker layer before writing**, where they skip. And every human
decision (approve / edit / flag / answer a gap) is captured as **reusable structured context** — the matrix
is the surface, the captured decisions are the compounding layer.

### 8. "How do you make money?"
The wedge is the first-read itself: an **outsourced tender review starts at £950**, and one missed
deal-breaker bins a **~£4,000, 2–8-week** bid. Bidframe does that first read in minutes — a per-tender /
per-seat product a small firm can actually afford, priced well under the £950 review or a £35–50k hire.

### 9. "Does it scale — what breaks first?"
The deterministic net is a **reliability floor**, so scale doesn't erode the guarantee — it's tuned
**recall-first**, so the failure mode as tenders get messier is *over-flagging for a human to clear*, never
a silent miss. Cost is bounded (parser + OCR caps, parallel per-chunk extraction). The open honest limit:
lexical reconcile can occasionally merge near-identical same-page requirements — mitigated by an AND-gate.

### 10. "What's proven vs. still scoped?"
**Proven:** deal-breaker catch (26/26 validated, held-out generalisation), 0 bluffs on drafting (groundedness
detector), source traceability, human-in-control workflow. **Scoped:** a bigger benchmark for broad recall,
enterprise multi-user, live-at-scale extraction throughput. We're precise about the line — that's the point.

### 11. "Real tenders come as a pack of Word and Excel files — can it read those, or just PDFs?"
Honest and on-message: *"The stage demo is the frozen PDF run. Reading the whole **pack** — the ITT PDF plus
Word return forms and Excel pricing schedules — into the same source-backed matrix is what we're shipping
today. The deal-breaker net is already **format-neutral**, so a pass/fail buried in a spreadsheet gets caught
the same way."* **Don't claim it's live** until the release gate in `ops/mixed-pack-qa-log.md` is green — say
"shipping today," not "done," unless it is.

---

**If cornered on accuracy:** *"The strong, validated number is deal-breaker catch — that's what a bid can't
afford to miss, and it's reproducible on gold and unseen tenders. Broader recall is promising but
small-sample, so we don't put a headline percentage on it."*
