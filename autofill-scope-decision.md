# Scope Decision — Auditable Autofill (the ghostwriting extension)

> 🟢 **STATUS: DECISION (NEW, Day 1).** Bidframe extends from a compliance/extraction tool into an
> **end-to-end bid-drafting tool** — but messaged as **auditable autofill**, never "we write your bid."
> **This reshapes the build for every role and changes the locked schema → needs team ratification at
> standup + a schema PR.** Until ratified, treat as PROPOSED. J owns the framing + prompts; the engine
> work is shared.

---

## The decision in one line

**Bidframe reads the tender, builds the verified requirement matrix, then drafts a grounded answer to
every requirement from the bidder's own capability documents — and asks the human only the questions it
genuinely can't answer.** Upload tender → review requirements → answer a few targeted questions →
walk away with a drafted, source-traceable compliance response.

## The framing discipline (non-negotiable)

We build the *full* ghostwriting capability but we **never use generative-tool language**. Why: the
incumbent **AutogenAI** owns "AI writes your bid" at enterprise prices; competing there on prose quality
is a fight we lose. We win by making generation **auditable** — the thing they treat as a black box.

| Say this | Never say this |
|---|---|
| "Drafts a grounded answer to each requirement" | "Writes your bid for you" |
| "Every claim traceable to your evidence" | "AI-generated bid content" |
| "Asks you only what it can't answer" | "Fully automated bid writing" |
| "Auditable autofill — you stay in control" | "Replace your bid writer" |

## Why this is coherent, not a pivot away from the wedge

The product's soul is **honesty about uncertainty + full traceability**. Autofill inherits both:

- **Two-sided traceability.** Each drafted answer links back to BOTH (a) the tender requirement + its
  source clause (*why* you must answer it) and (b) the capability-doc evidence it's built from (*what*
  backs the claim). Nothing is unverifiable. This is the extraction wedge, extended to the answer side.
- **Gap-awareness = the same "needs_review" DNA.** Extraction says "I'm unsure about these 2%." Autofill
  says "I answered these 40 from your docs; for these 6 I need to ask you X." The questions aren't a
  weakness — they're the tool being honest, again.
- **The Conduct bridge gets stronger.** Capability docs + the human's answers to gap questions become
  **reusable org context that compounds across every future bid** — literally "capturing the context of
  the expert's decisions." This is our most direct mirror of Conduct's thesis yet.

## What it must NOT do

- **Must not steal time from extraction.** Auditable extraction + the disqualifier catch + measured recall
  remain the spine and the scored 35%. The **Day-4 integration gate is on extraction**, not autofill.
  Autofill ships only once that gate is green.
- **Must not produce confident slop.** A mediocre auto-written answer shown to a real bid manager
  *undermines* the trust the matrix earned. Ground every answer or mark it "needs your input" — never
  bluff. Same rule as extraction: when unsure, flag, don't guess.

---

## Pipeline additions (on top of master-plan §4)

```
[existing: ingest → chunk → extract → classify → reconcile → route → graph → decision capture]
                                                                          │
                            ┌─────────────────────────────────────────────┘
                            ▼
11. Capability ingest   — bidder uploads 2–N capability docs (past bids, case studies, certs,
                          policies, capability statements). Chunk + index.            [backend]
12. Answer drafting     — per APPROVED requirement, RAG over capability docs → grounded draft
                          answer with evidence_refs. Low/no evidence → mark needs_input.  [generalist + J prompts]
13. Gap interview       — collect the needs_input requirements → generate a short, deduped list
                          of targeted questions for the human.                      [generalist + J prompts]
14. Fill + assemble     — human answers questions → fill gaps → assemble the drafted response,
                          each answer traceable to requirement + evidence.        [frontend UI + backend persist]
```

## Schema extension — PROPOSED (needs a branch + PR + team sign-off; do NOT edit AGENTS.md solo)

The locked requirement object already has `draft_answer: string | null`. We replace/augment it with a
richer answer block + open questions. **Additive where possible so the matrix UI doesn't break.**

```jsonc
// New/changed fields on the requirement object:
"answer": {                          // replaces the flat draft_answer (keep draft_answer as alias for v1 safety)
  "text": "string",                  // the drafted response to this requirement
  "state": "auto" | "needs_input" | "human_edited" | "empty",
  "evidence_refs": [                 // two-sided traceability: which capability-doc backs it
    { "doc_id": "cap-003", "excerpt": "verbatim from capability doc", "page": 4 }
  ],
  "confidence": 0.0                  // model's confidence the answer actually satisfies the requirement
} | null,
"open_questions": [                  // gap questions for the human; empty when fully auto-answered
  { "id": "q-req0001-1", "question": "What is your current ISO 9001 certificate expiry date?",
    "answer": null, "answered_at": null }
],
```

And a new top-level alongside `requirements[]` in the tender response:

```jsonc
"capability_docs": [
  { "doc_id": "cap-003", "filename": "case-studies-2025.pdf", "page_count": 12 }
]
```

> Migration safety: keep `draft_answer` populated (= `answer.text`) for v1 so the frontend matrix keeps
> working while the richer answer UI is built. Frontend can adopt `answer`/`open_questions` incrementally.

## Role implications (confirm at standup)

| Role | Added work | Guardrail |
|---|---|---|
| **Backend** | Capability-doc upload + ingest/index; persist answers + question responses; API for both | Only after extraction API is solid |
| **Generalist** | The answer-draft RAG + gap-detection (this was already theirs — now first-class, bigger) | Don't gold-plate prose; ground or flag |
| **Frontend** | Answer panel per requirement (draft + evidence links); the gap-question interview flow | Rides on the matrix; matrix ships first |
| **J** | Answer-generation prompt, gap-interview prompt, the positioning/framing, the demo beat | Protect the extraction gate |

## Demo arc (revised)

1. Upload a real tender → matrix populates → **disqualifier catch** (unchanged hero moment).
2. Click a requirement → **source clause highlighted** (trust, unchanged).
3. Approve requirements → Bidframe **drafts each answer from the bidder's capability docs**, every claim
   linked to its evidence.
4. **"It asked me 6 questions"** — the gap interview. Answer them → gaps fill.
5. Out comes a **drafted, fully traceable compliance response** — minutes, not weeks.
6. Accuracy number + "real bid managers wanted it."

### Changelog
- **2026-06-28 (Day 1)** — Decision recorded by J: extend to auditable autofill, full capability,
  disciplined framing. Pending team ratification + schema PR.
