# Tender Breakdown — Agent Guide

Conduct "Make Legacy Move" hackathon project. This repo extracts requirements from UK public-sector tender PDFs and presents them in a compliance matrix for bid managers to review.

## Repo layout

```
/backend          Python + FastAPI (PDF ingest, extraction, API) — skeleton in place
/frontend         Next.js + React + Tailwind — compliance matrix UI (Day 1 deliverable)
tender-master-plan.md   Source of truth for schema, pipeline, and roles
role-*.md         Per-person day-by-day briefs
```

## Git workflow — every agent and human MUST follow this

We are 4 people building in parallel for 7 days. The rules below keep `main`
always demo-able while moving fast. **Agents: follow these exactly. Do not invent
your own branching scheme.**

**Model: trunk-based.** Work directly on `main` for normal changes in your own
area. We do NOT open a PR for everyday work — that's too slow for this sprint.

**The daily loop (run this constantly):**

```bash
git pull --rebase        # 1. ALWAYS pull before you start AND before you push
# ...make a focused change...
git add -A
git commit -m "clear message"   # commit small and often
git pull --rebase        # 2. pull again in case a teammate pushed while you worked
git push                 # 3. share it
```

`--rebase` keeps history linear. It's the default in this repo
(`git config pull.rebase true` is assumed). Never use a plain merge-pull.

**Stay in your lane.** Each role owns a folder (see Team roles). Frontend agents
edit `/frontend`, backend agents edit `/backend`. This is what makes concurrent
pushes conflict-free — do not edit another role's files without coordinating.

**Branch + PR ONLY for these two cases** (everything else goes straight to `main`):
1. A change to the **locked requirement schema** (it breaks both sides at once).
2. A **large or risky change** that could leave `main` broken (a big refactor).
   Branch name: `<role>/<short-name>` (e.g. `frontend/graph-view`). Open a PR,
   get one teammate's glance, merge, delete the branch.

**Hard rules for agents:**
- **Never push a broken build.** Run the project's build/lint (see Commands)
  before pushing. If it fails, fix it or don't push.
- **Keep `main` runnable at all times** — it is the live demo branch.
- If `git pull --rebase` reports a **conflict inside your own area**, resolve it
  and continue. If the conflict is in **another role's files or the schema**,
  STOP and tell the human — do not guess.
- **Never** `git add -f` past `.gitignore`. Never commit `.env`, secrets,
  `node_modules/`, `.venv/`, or tender PDFs.
- **Never** force-push `main` (`git push --force`) or rewrite shared history.
- Write commit messages a teammate can scan: what changed, not "wip".

## Data contract (lock this shape)

Every requirement flowing through the system matches this schema. Frontend builds against mock data in this exact shape; backend + generalist produce it for real.

```json
{
  "id": "req-0001",
  "text": "The supplier must hold ISO 9001 certification.",
  "source_page": 14,
  "source_clause": "Section 4.2.1",
  "source_excerpt": "verbatim snippet the requirement was extracted from",
  "type": "mandatory",
  "is_gating": true,
  "category": "certification",
  "confidence": 0.92,
  "status": "pending",
  "needs_review": false,
  "decision": null,
  "criteria_ref": "award-criterion-3",
  "depends_on": ["req-0007"],
  "draft_answer": null,                  // DEPRECATED alias of answer.text — kept so the v1 matrix UI keeps working

  "answer": {                            // auditable autofill: grounded draft response to this requirement (nullable)
    "text": "We hold ISO 9001:2015, certificate no. ...",
    "state": "auto",                     // "auto" | "needs_input" | "human_edited" | "empty"
    "evidence_refs": [                   // two-sided traceability — which capability doc backs the claim
      { "doc_id": "cap-003", "excerpt": "verbatim snippet from the bidder's capability doc", "page": 4 }
    ],
    "confidence": 0.88                   // model's confidence the answer satisfies the requirement (0–1)
  },
  "open_questions": [                    // gaps the human must answer; empty when fully auto-answered
    { "id": "q-req0001-1", "question": "What is your ISO 9001 certificate expiry date?",
      "answer": null, "answered_at": null }
  ]
}
```

`answer` and `open_questions` are **additive** (Day-1 autofill extension — see `autofill-scope-decision.md`). Both nullable/empty until the autofill pipeline runs; the compliance matrix renders without them. `draft_answer` stays populated (= `answer.text`) for v1 so nothing breaks during migration.

A tender response: `{ "tender_id", "title", "requirements": [ ...requirement objects ], "capability_docs": [ { "doc_id", "filename", "page_count" } ] }`. `capability_docs` lists the bidder's uploaded evidence (empty until any are uploaded).

## Frontend conventions

- **Stack:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4.
- **Mock-first:** `src/data/mock-requirements.ts` holds fake data shaped like real API output. Swap the data source later — the UI should not change.
- **Compliance matrix columns:** requirement text · mandatory? · source · confidence · status.
- **Visual rules (non-negotiable for judges):**
  - `is_gating` mandatory requirements must stand out (badge + row highlight).
  - `needs_review` items must look obviously uncertain — the tool is honest, not guessing.
  - Confidence is shown as a glanceable bar/dot, never a raw number like "0.92".
- **Components live in** `src/components/`. Types in `src/types/`.
- Read `node_modules/next/dist/docs/` before changing Next.js APIs — v16 has breaking changes from earlier versions.

## Backend API (future)

FastAPI will expose:

- `POST /tenders/upload` — ingest PDF
- `GET /tenders/{id}/requirements` — requirement list
- `PATCH /requirements/{id}` — update status + decision

Frontend currently uses mock data only. Point `page.tsx` at the API when backend Day 1 mock endpoint is ready.

## Commands

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## What not to do

- Do not change the requirement schema without team agreement (Day 1 lock).
- Do not show raw confidence numbers in the UI.
- Do not over-build graph view, upload flow, or answer-draft before the matrix works.
- Do not commit `.env`, credentials, or `node_modules`.

## Team roles

| Person | Owns |
|--------|------|
| Backend | PDF ingest, chunk, extract, classify, graph, REST API, SQLite |
| Generalist | Reconcile/dedupe, confidence routing, eval harness, answer-draft |
| Frontend | Compliance matrix, source panel, decision controls, graph view, demo |
| J | Prompts, orchestration, narrative, standups, glue |

See `role-*.md` for day-by-day build order.
