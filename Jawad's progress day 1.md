# Jawad's Progress — Day 1 (Frontend)

> Living log of what **I (Jawad, frontend)** have built for **Bidframe**. Newest section at the bottom of "Shipped".
> Source of truth for *team-wide* state stays [STATUS.md](STATUS.md); this is just my personal lane.
> **Role:** compliance matrix · source panel · decision controls · graph view · demo. **Lane:** `/frontend`.

**Started:** 28 Jun 2026 (Day 1) · **Demo:** 4 Jul 2026
**Live site:** https://frontend-alpha-neon-w699itcsq5.vercel.app (auto-deploys on every push)

---

## TL;DR

The whole front-end is wireframed, branded **Bidframe**, and **live on Vercel** — built mock-first against the locked requirement schema, so it's never blocked on the backend. A bid manager can open a tender, see the deal-breakers shout, click any requirement to read its source and approve / edit / flag it, view the relationship graph, and walk the upload flow. Decisions persist in-memory as you move around (no browser storage — the brief forbids it).

---

## Shipped — Day 1

### 1. Compliance matrix (the Day-1 core)
- Table over `mock-requirements.ts` shaped exactly like the locked API schema (`AGENTS.md` §Data contract).
- **Gating / deal-breaker rows stand out** (badge + row highlight); `needs_review` items deliberately look *hesitant* — the tool is honest, not guessing.
- **Confidence is visual only** (bar/dot), never a raw number like "0.92" — a hard judge-facing rule.
- Columns: requirement text · mandatory? · source · confidence · status.

### 2. Multi-page product shell (wireframes for the remaining sections)
Shipped as functional, mock-driven wireframes (polish pass comes later):
- **Persistent navbar** — `Upload · Matrix · Graph`, mounted in the root layout, active link highlights per route.
- **Source + decision slide-over drawer** — click a row → panel slides in from the right with the verbatim `source_excerpt`, page, and clause, plus **Approve / Edit / Flag** controls (Edit & Flag reveal a note field). Esc / scrim-click to close.
- **Gating "hero" banner** — red callout atop the matrix: "N deal-breakers — miss any one and the bid is disqualified," listing them. This is the demo gut-punch moment.
- **Relationship graph** (`/graph`) — React Flow (`@xyflow/react` v12) diagram: requirement nodes → award-criteria nodes (`criteria_ref`) and req → req (`depends_on`). Gating nodes red, `needs_review` amber, readable two-column layout (not a hairball).
- **Upload flow** (`/upload`) — drag-and-drop "drop a tender PDF" shell with a fake "extracting…" state → link back to the matrix. Wireframes the Day-4 live-upload moment.

### 3. In-memory decision state
- `RequirementsProvider` (React Context) in the root layout, seeded from the mock. Approve / edit / flag update `status` + a `decision { action, note, timestamp }`.
- Decisions survive navigation (App-Router layouts don't re-mount) — **no `localStorage`**, per the brief. This is the stand-in for the future `PATCH /requirements/{id}` call; swapping to the real API later only touches the provider.

### 4. Rebrand to **Bidframe**
- Renamed all UI strings (`Tender Breakdown` → `Bidframe`) and the `TB` → `BF` monogram across Header, NavBar, and every page's `metadata` title.

### 5. Mirrored the additive autofill schema
- Added `answer` `{ text, state, evidence_refs[], confidence }`, `open_questions[]`, and `capability_docs[]` to `src/types/requirement.ts` (additive/nullable — the matrix renders unchanged).
- Seeded two worked mock examples: one **auto-drafted** answer with an evidence citation, one **`needs_input`** answer with a gap question. Kept `draft_answer` as a deprecated alias so nothing breaks.

### 6. Deploy pipeline (live + automatic)
- App deployed to **Vercel** (monorepo, Root Directory = `frontend`).
- **GitHub auto-deploy wired**: every `git push` builds and ships the live site. (Routed through a personal `TenderBreak` mirror repo because the Welddevelopment org couldn't authorize the Vercel app — one push updates both the team repo and the deploy mirror.) CLI deploy kept as a fallback.

---

## Tech stack
- **Next.js 16** (App Router, Turbopack) · **React 19** · **Tailwind CSS v4** · **TypeScript 5** · `@/` → `src/`.
- **`@xyflow/react` v12** (React Flow) for the graph.
- Mock-first: `src/data/mock-requirements.ts`. Types: `src/types/requirement.ts`. Components: `src/components/`.

## Run it locally
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run build      # must pass before every push
npm run lint
```

## Key files (my lane)
- `src/app/layout.tsx` · `src/app/page.tsx` · `src/app/graph/page.tsx` · `src/app/upload/page.tsx`
- `src/components/` — `NavBar`, `MatrixView`, `ComplianceMatrix`, `RequirementDrawer`, `GatingHero`, `GraphView`, `UploadDropzone`, `Header`
- `src/context/RequirementsContext.tsx`
- `src/data/mock-requirements.ts` · `src/types/requirement.ts`

---

## Next up (priority order)
1. **Answer + evidence panel** — render the `answer` text *with its evidence citation* (which capability doc backs each claim). The visible payoff of the autofill schema and the team's headline differentiator ("auditable autofill").
2. **Gap-interview UI** — surface `open_questions` as a tidy to-do list the bidder answers. Pairs with #1.
3. **Capability-doc upload mode** — a second upload lane for the bidder's own evidence docs (`capability_docs`).
4. **Swap to the real backend** — point the provider at `GET /tenders/{id}/requirements` (J's pipeline is live and CORS already allows `:3000`); the UI shouldn't change.
5. **Design-system pass** — typographic + spacing polish over the wireframes (brief says wireframe-first, polish later).

## Blocked on / waiting
- Nothing hard-blocking. Real-data swap can start any time — backend API is up (heuristic extractor; Claude/OpenAI path lands when the key is in).

---

## Changelog
- **2026-06-28 (Day 1)** — Initial log. Shipped items 1–6 above: compliance matrix, multi-page wireframes (navbar, drawer, gating hero, graph, upload), in-memory decision state, Bidframe rebrand, autofill schema mirror, Vercel deploy + GitHub auto-deploy. _(append new days below)_
