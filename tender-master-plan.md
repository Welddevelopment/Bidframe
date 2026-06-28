# Tender Tool — Master Build Plan

*Conduct "Make Legacy Move" track. Build days 29 Jun–3 Jul, demo 4 Jul. Working name: TBD (pick Day 1).*

---

## 1. Summary

**What it is:** a tool that takes a real tender (a 50–150+ page document a company must respond to to win a contract), and in minutes extracts every requirement, links each to its exact source, flags the mandatory "disqualifying" ones, and lets a bid manager verify and approve each — compressing ~3 weeks of expert work into minutes, with the human in full control.

**Why it wins:** novelty isn't scored (Conduct confirmed any real enterprise process counts). We win on the four scored criteria — **real process · real speed-up · user in control · clear demo** — plus the engineering bar underneath: **it survives messy real tenders and flags uncertainty instead of guessing** (the 35% slice where most teams fail).

**Our edges:** execution + a demo that doesn't break (judges upload a tender live) · specialisation in one niche (construction ITTs or UK public-sector — pick Day 1) · full source traceability · the context-graph framing (we capture the bid manager's *decisions*, mirroring Conduct's moat) · real bid managers on record saying they'd use it.

**Architecture (settles the team debate):** the LLM does the heavy reading; *we* do the engineering around it (chunking, structured output, grounding, reconciliation, confidence-flagging, decision capture, accuracy measurement). **Not a thin wrapper. Not NotebookLM** (closed app we can't measure, structure, control, or claim). We call the LLM API directly in our own pipeline, using the sponsor credits.

---

## 2. Tech stack (agreed, so everyone's compatible)

- **Repo:** one monorepo — `/backend` (Python) + `/frontend` (Next.js).
- **Engine (backend + generalist):** Python + **FastAPI**, exposing a REST API.
- **LLM:** sponsor credits (OpenAI / Anthropic / Gemini). Structured output via JSON-schema / function-calling — never free text we re-parse.
- **PDF:** PyMuPDF (`fitz`) primary; pdfplumber fallback for tables.
- **Storage:** SQLite (persists requirements + decisions; zero-config).
- **Frontend:** Next.js + React + Tailwind, talks to FastAPI over REST.
- **Eval/reconcile (generalist):** Python, same repo.

---

## 3. The data contract (THE coordination artifact — lock Day 1)

Everything passes the **requirement object**. Frontend builds against this as mock data Day 1; backend + generalist produce it for real. Lock the shape before anyone goes deep.

```json
{
  "id": "req-0001",
  "text": "The supplier must hold ISO 9001 certification.",
  "source_page": 14,
  "source_clause": "Section 4.2.1",
  "source_excerpt": "verbatim snippet the requirement was extracted from",
  "type": "mandatory",            // "mandatory" | "optional"
  "is_gating": true,              // would missing this disqualify the bid?
  "category": "certification",
  "confidence": 0.92,             // 0–1
  "status": "pending",            // "pending" | "accepted" | "edited" | "flagged"
  "needs_review": false,          // true when confidence below threshold
  "decision": null,               // {action, note, timestamp} once the human acts
  "criteria_ref": "award-criterion-3",   // scoring criterion it maps to (nullable)
  "depends_on": ["req-0007"],     // dependency edges (may be empty)
  "draft_answer": null,           // DEPRECATED alias of answer.text (kept for v1 matrix UI)

  // --- auditable autofill extension (additive; see autofill-scope-decision.md) ---
  "answer": {                     // grounded draft response to this requirement (nullable)
    "text": "...",                // the drafted answer
    "state": "auto",              // "auto" | "needs_input" | "human_edited" | "empty"
    "evidence_refs": [ { "doc_id": "cap-003", "excerpt": "...", "page": 4 } ], // capability-doc backing
    "confidence": 0.88            // 0–1, that the answer satisfies the requirement
  },
  "open_questions": [             // gaps for the human; empty when fully auto-answered
    { "id": "q-req0001-1", "question": "...", "answer": null, "answered_at": null }
  ]
}
```

A tender processes into `{ "tender_id", "title", "requirements": [ ...requirement objects ], "capability_docs": [ { "doc_id", "filename", "page_count" } ] }`. `answer`/`open_questions`/`capability_docs` are additive — nullable/empty until the autofill pipeline runs, so the compliance matrix renders without them.

---

## 4. How it works (technical pipeline)

1. **Upload & ingest** — PDF(s) → text preserving **page numbers + section structure** (PyMuPDF/pdfplumber). *[backend]*
2. **Chunk (anti-wrapper step)** — structure-aware, overlapping chunks so nothing in a 150-page doc is lost. *[backend]*
3. **Extract (LLM)** — each chunk → requirement objects as structured JSON. *[backend]*
4. **Classify** — mandatory/optional, gating, category, raw confidence. *[backend]*
5. **Reconcile & dedupe** — merge requirements appearing across chunk boundaries; finalise confidence. *[generalist]*
6. **Confidence routing** — below-threshold items get `needs_review: true` instead of being presented as fact. *[generalist]*
7. **Build the graph** — link requirements to source, criteria, dependencies; flag gating. *[backend]*
8. **Decision capture + state** — human's accept/edit/flag stored per requirement. *[backend persistence + frontend UI]*
9. **Answer draft (shallow)** — first-pass response per requirement from 2–3 capability docs. *[generalist]*
10. **Verification loop** — gold-set eval measures recall / precision / mandatory-accuracy → the headline number. *[generalist]*

---

## 5. What the user sees

Upload → processing → **the compliance matrix** (every requirement: text · mandatory? · source · confidence · status) → **the hero moment** (the gating requirement that would void the bid, front and centre) → click any requirement → **source panel** with the exact clause/page highlighted → **uncertain items flagged** for the human → **the graph view** (requirements ↔ sources ↔ criteria, gating lit up) → **approve/edit/flag each** (decisions captured) → optional draft answers → **export** the matrix + decisions.

Before/after: *before* = 3 weeks of reading and a disqualifier risk; *after* = minutes, killer requirement caught, every line checkable.

---

## 6. Role split (rebalanced — grunt work shared, generalist co-owns the engine)

**Whole-team chores (not one person's job):**
- **Day-1 sourcing sprint** — all four grab a few tenders each from Contracts Finder / Find a Tender (filter for full-pack-attached); 10–15 in an hour. *Confirm one downloads cleanly in hour one.*
- **Gold-set labelling** — each person hand-labels **one** tender end-to-end by end of Day 2 (everyone reads one real tender → sharper team intuition). Four labelled tenders, not one person grinding three.

**The engine has two owners (de-risks the bottleneck):**
- **Backend:** ingest · chunk · extract · classify · graph relationships · persistence · the REST API.
- **Generalist:** reconcile/dedupe · confidence calibration + flag-routing · the eval harness · shallow answer-draft. Real engineering, clean interface (both agree the intermediate "raw extraction list" format Day 1 so they parallelise).
- Both pair on **Day-4 hardening**.

**Frontend:** the entire control UI (carries ~40% of the score).
**J:** orchestration/prompts · narrative + thesis-bridge · traction · glue + standup.

Full day-by-day per person is in the four role files.

---

## 7. Coordination + submission

- **Hour one:** confirm a full tender pack downloads cleanly. **Day 1:** lock the JSON schema + intermediate format. **End Day 2:** gold set exists.
- **Daily 10-min standup** (J): done / blocked / Day-4 gate on track?
- **Day 4 = integration gate:** end-to-end on a fresh tender. Not working by end of Day 4 → Day 5 cuts scope, doesn't add.
- **Guardrails:** don't over-build the graph; don't over-build the answer-draft. Both steal from the 35%.
- **Submission (Day 5):** live-demo capability · README (prior-art note + context-graph framing) · headline accuracy number · demo video · repo link · *(if stacking Fetch)* agent on Agentverse + badges.

**Open decisions (Day 1):** pick the niche · name the tool · (later) second track to stack.
