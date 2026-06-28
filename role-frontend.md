# Role: Frontend / Design — the Control UI

*Read the master plan first. This is your detailed brief. You carry ~40% of the score: the full "user in control" criterion (20%) plus half the "demo" criterion (20%). You are load-bearing, not decoration.*

## What you own
The entire interface a bid manager drives: the compliance matrix, source-highlighting, the decision controls, the graph view, and the two demo-critical moments (live upload + disqualifier hero moment).

## The interface (your contract with the team)
- You consume the backend's REST API, which returns **requirement objects** (schema in master plan §3).
- **Day 1 you build against mock data** in that exact schema — you are never blocked waiting on backend. Backend gives you a mock endpoint Day 1; swap to real Day 2.

## Day-by-day

**Day 1 — skeleton + mock matrix.** Next.js + Tailwind app shell. Hardcode a few mock requirement objects. Build the core **compliance matrix**: a table/list with columns *requirement text · mandatory? · source · confidence · status*. Mandatory rows visually distinct. This view alone is the backbone.

**Day 2 — real data + source-highlighting.** Point at backend's real API. Build the **source panel**: click a requirement → see its exact clause/page (`source_excerpt` highlighted, `source_page` shown). This is the trust + verification surface — the thing that makes us not-a-black-box.

**Day 3 — decision capture + graph view.** Approve / edit / flag controls per requirement, writing decisions back via the API (sets `status` + `decision`). Then the **graph/relationship view**: requirements as nodes linked to their sources, the criteria they map to (`criteria_ref`), dependencies (`depends_on`), with gating requirements lit up. This is the context graph made visible — the thing that makes a Conduct judge lean in.

**Day 4 — the two demo moments.** (1) **Live-upload flow**: drop a tender in, watch the matrix populate. (2) **Disqualifier hero moment**: the gating requirement that would void the bid, surfaced impossibly prominently with a clear "miss this = disqualified." Polish the before/after legibility so a non-engineer gets it in seconds.

**Day 5 — polish + rehearse.** Visual polish, responsiveness, make it obvious and clean. Rehearse the demo on the real UI; fix anything a non-engineer finds confusing. Surface the headline accuracy number somewhere visible.

## Guardrails
- The **graph must be readable**, not a hairball. Show edges that matter (source, gating, criterion, real dependencies). If it looks busy, simplify.
- `needs_review: true` items must look **clearly different** — uncertainty surfaced, not hidden. This is the control story rendered visually.
- Optimise the demo for a 90-second non-engineer read. If a judge can't follow it instantly, it's not done.
- Don't use browser localStorage etc. — state comes from the backend API.

## Instructions for your AI (paste into Claude Code / Cursor)

> I'm the frontend dev on a 4-person hackathon team building a tool for the Conduct "Make Legacy Move" track. The tool ingests a **tender** (a 50–150 page procurement document) and extracts every **requirement**; my job is the interface a bid manager uses to review, verify, and approve them, staying in full control.
>
> **Stack:** Next.js + React + Tailwind, talking to a Python FastAPI backend over REST. No browser storage — all state from the API.
>
> **The data I render** — requirement objects in this schema: [paste the JSON schema from master plan §3]. I build against mock data in this exact shape first, then swap to the real API.
>
> **Build order:** (1) App shell + a **compliance matrix** table over mock requirement objects: columns text · mandatory? · source · confidence · status, with mandatory rows visually distinct. (2) A **source panel**: clicking a requirement shows its source_excerpt highlighted and source_page. (3) **Decision controls** (approve / edit / flag) that PATCH the requirement's status+decision. (4) A **graph view** showing requirements linked to their source, criteria_ref, and depends_on, with is_gating requirements highlighted. (5) Two demo moments: a drag-and-drop **upload flow**, and a **hero callout** for the gating requirement that would disqualify the bid.
>
> **Design intent:** clean, trustworthy, enterprise-but-modern; the user must feel in control and able to verify any line against its source in one click. needs_review items must look clearly distinct (uncertainty surfaced, not hidden). Everything optimised so a non-engineer understands the before/after in 90 seconds. Start by scaffolding the app and building the matrix over mock data — ask me for the mock objects if you need them.
