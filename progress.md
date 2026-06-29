# Bidframe — Progress Log

> **A steady, timestamped log of how Bidframe got built.** Updated ~hourly (or whenever something
> ships). The point is twofold: keep a heartbeat of momentum during the sprint, and — at demo time —
> cherry-pick the milestones into a **"how we built it" progression beat** (4 people, async over git,
> zero → working tool in days).
>
> **This is the timeline. The pitch is [demo-narrative.md](demo-narrative.md); current state is
> [STATUS.md](STATUS.md).** Don't duplicate those here — this is the running story.
>
> **How to add an entry (do this ~hourly):** append one line under today's date —
> `**HH:MM** — what changed *(why it matters)*`. Keep it to a line. Update the Snapshot block when the
> top-line moves. Owner: J; any role can add a line for their own lane.

---

## Snapshot (kept current)

- **Where we are:** end-to-end spine proven on a **real** tender on Day 2. Backend pipeline live on
  Render; full frontend live on Vercel; eval harness producing real numbers.
- **Headline number:** SPSO tender (pp.1–6), OpenAI extractor → **recall 0.947 (18/19), every
  disqualifier caught (gating recall 1.0), 0 dangerous misses.** Likely understated (gold still being
  completed, extraction prompt still v1).
- **Next up:** complete the SPSO gold set, tighten the gating prompt + re-eval, get hackathon OpenAI
  credits → wire the key into Render for a live hosted demo.

---

## Day 1 — Sun 28 Jun 2026

- **Kickoff + decisions locked:** name **Bidframe**; niche = **UK public-sector, SME bidders + small
  consultancies**; requirement schema locked; agent comms channel (`comms/`) + first standup; LLM
  provider = **OpenAI**. *(The coordination scaffolding that let 4 people build in parallel without
  colliding.)*
- **Prompts written** (extraction, classification, answer-generation, gap-interview) + the
  backend→generalist **raw-extraction contract** + mock. *(The spec everyone built against.)*
- **Auditable-autofill scope ratified** + schema extended additively on `main` (answer / open_questions
  / capability_docs) — extends Bidframe from "compliance matrix" to "drafts your response," without
  breaking the matrix.
- **🟢 Hour-one risk retired:** a real tender (SPSO Cleaning ITT) parsed clean — 13pp, page numbers
  intact. *(The single biggest silent engine risk, gone on Day 1.)*
- **Backend pipeline scaffolded + tested end-to-end** (J covering while backend's laptop was down):
  ingest → chunk → extract → SQLite → all 3 REST endpoints. 20 requirements pulled from SPSO + persisted.
- **Frontend: whole product wireframed + deployed to Vercel** — compliance matrix, the gating
  "deal-breaker" hero, click-to-source drawer, relationship graph, upload flow, autofill answer/evidence
  panel, gap-interview; Bidframe rebrand; Bidframe colour + typeface system; wired to the live API
  (mock by default so the demo is zero-surprises). *(Carries ~40% of the score and it's already live.)*

## Day 2 — Mon 29 Jun 2026

- **~00:30 — Generalist shipped the `engine/`:** reconcile/dedupe + the eval harness (60 tests green);
  the closed reconcile→eval loop scores 1.0 on the mock. Raw-extraction format signed off.
- **~00:40 — 🟢 First REAL number on a real tender** (SPSO pp.1–6, OpenAI extractor):
  **recall 0.947 (18/19) · gating recall 1.0 (both disqualifiers caught) · 0 dangerous misses.**
  *(The whole thesis — measured recall + catch the disqualifier — demonstrated on real data, Day 2.
  This is effectively a Day-4-gate dry run, passed early.)*
- **~00:30 — Backend deployed live to Render** (`bidframe-api.onrender.com`, verified) → frontend's
  hosted-demo blocker cleared.
- **~01:10 — Glue pass (J):** STATUS refreshed for Day 2; `source_clause` made nullable across the
  frontend; **confirmed the 0.947 is the OpenAI path** (the no-key heuristic scores ~0.32 and misses
  both disqualifiers → any real demo must run the OpenAI path). Personal OpenAI credits for now;
  hackathon credits coming.
- **01:19 — Started this progress log.**
- **03:03** — Gating prompt tightened (`is_gating` defaults false, true only for confirmed disqualifiers) to fix G-003 over-flagging; traction research dossier built overnight (8 cycles → named UK bid-writing consultancy targets, competitor intel, 5 paste-ready LinkedIn outreach variants) *(re-eval pending: gating accuracy expected to rise while recall 1.0 holds; GTM legwork pre-done for Day 3)*
- **04:03** — Traction dossier extended to cycle 11 + full QA pass: warm-intro paths mapped, 60-second live-demo script drafted, first live ITT identified, SME education-IT MSPs named *(Day-3 outreach playbook is production-ready; opening GTM move can land today)*
- **05:03** — Traction dossier extended with 5 named care-sector SME bidders (Care at Home Group, Lumina Care, Able Support, Yes Care, Bluebird Care St Helens) sourced from St Helens Domiciliary Care Approved List 2025/26 + Ian Evans LinkedIn handle identified *(real named-target CRM now ready for cold outreach — contacts from public data, not invented)*
- **06:04** — Traction dossier finalised: thin sectors filled (named SME caterers + grounds firms), bid-writing consultancy contacts pinned — Amanda Goode (Think Tenders) + Robin Clarkson (BidRight) *(CRM now spans all target segments; Day-3 outreach playbook is production-ready across every lane)*
- **08:04** — Traction dossier bench deepened: Chris Hugo (GovData), Mike Baron (BWS), Matt Smith (Complete Tenders, verified) + SME cleaner Garioch (Aberdeenshire win) pinned *(bid-consulting lane now has 5 named verified contacts — the highest-leverage Day-3 outreach segment)*
