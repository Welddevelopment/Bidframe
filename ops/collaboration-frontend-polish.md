# Collaboration UI — frontend polish brief (owner: @frontend / Jawad)

The multi-user collaboration **foundation is shipped and building on `main`** (backend + frontend). This
brief is the *polish* pass to make it shine for the video. **Reuse the primitives below — do not reinvent
avatars, colours, or the "you vs name" logic.** No schema change; everything degrades to "you" when signed
out so the frozen `/showcase` + `/pack` are unaffected.

## What already exists (don't rebuild)

**Backend (live on `main`, tested):** `POST /tenders/{id}/share {email}`, `GET /tenders/{id}/members`,
`can_access` guards (owner OR shared member), `decision.actor` stamped **server-side** (un-forgeable),
`users.name`, `/auth/me` returns `name`.

**Frontend foundation:**
- **`frontend/src/lib/collaborators.ts`** — the shared primitives. USE THESE:
  - `collaboratorFor(actor)` → `{ key, name, initials, color }` (stable per-person colour, muted on-brand palette).
  - `actorLabel(actor, currentUserId)` → `"you"` when it's the signed-in user or unknown, else the display name.
  - `displayName(actor)` → name ?? title-cased email local-part.
- **`frontend/src/lib/api.ts`** — `shareTender(id, email)`, `listMembers(id)`, `TenderMember`, `AuthUser.name`.
- **`frontend/src/types/requirement.ts`** — `Actor` + `RequirementDecision.actor?`.
- **`frontend/src/context/RequirementsContext.tsx`** — stamps `decision.actor` from `useAuth().user` on every
  decision (`applyDecision`/`applyDecisionMany` via `withActor`). Backend re-stamps authoritatively.
- **`frontend/src/components/RequirementPanel.tsx`** — per-row attribution done: `statusWord(req, userId)` +
  `auditLine(req, userId)` + `ApprovalStamp by={approvedBy}` ("Approved by <name>").
- **`frontend/src/components/ActivityFeed.tsx`** (new) — who-did-what, newest first; mounted in `MatrixView`
  after `<ControlPanel/>`.
- **`frontend/src/components/ShareControl.tsx`** (new) — invite-by-email + member avatars, inline panel;
  live-only (`isApiEnabled()`), mounted in `MatrixView`.

## Polish tasks (ranked by demo value)

### 1. Avatar on decided matrix ROWS — the highest-value visible add
Today the matrix row margin shows the format ref + gating pennant + confidence bead (`ComplianceMatrix.tsx`
~L269-302) but **not who decided it**. Add a small **initials avatar chip** on any row whose `req.decision`
exists, using `collaboratorFor(req.decision.actor)` for initials + colour (skip when `actor` is null → it's
"you", optionally a neutral dot). This is what makes "who approved what" scannable at a glance across the whole
matrix — the money shot for the video.

### 2. Per-person tally + members strip in `ControlPanel`
`ControlPanel.tsx` (~L23-214) already counts accepted/edited/flagged from `requirements`. Add:
- a **"from N documents"**-style **per-person breakdown** ("2 approved by Sarah · 1 flagged by James"),
  computed by grouping `requirements[].decision.actor` (reuse `collaboratorFor`/`displayName`).
- a small **"people on this tender"** avatar strip. On the live build, source it from `listMembers(tenderId)`
  (via `useRequirements().tenderId`); on the frozen build, derive the set from the actors present in decisions.

### 3. Upgrade `ShareControl` to a proper dialog
`ShareControl.tsx` is a functional inline panel. Polish it: a real modal/popover with focus trap + Esc, clearer
success ("Shared with Marcus ✓") and error states, and an avatar-per-member list. Keep it **owner-gated**
(backend enforces) and **live-only** (`isApiEnabled()` — it must stay hidden on the frozen demo).

### 4. Placement + visual polish
I mounted `ShareControl` (top-right) and `ActivityFeed` under `<ControlPanel/>` in `MatrixView.tsx` as a first
cut — refine the placement and grade to the civic-record look. Consider the Share button living in the
`DocumentHeader` beside the tender title, and the ActivityFeed as a right-rail or a collapsible panel.

### 5. Browser-test the real two-account flow (acceptance)
Locally (needs @backend's redeploy for the hosted version — J-096):
```
cd backend
python -m app.admin create-user alice@bidframe.co.uk --name "Alice Bidmanager" --password alicepw123
python -m app.admin create-user bob@bidframe.co.uk   --name "Bob Compliance"   --password bobpw12345
# run backend (uvicorn app.main:app --reload) + frontend with NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
Sign in as Alice → upload a tender → **Share** to `bob@bidframe.co.uk` → sign in as Bob (other browser/profile)
→ open the same tender → both approve/edit/flag → confirm attribution ("Approved by Alice") + the activity feed
+ member avatars all update. That flow *is* the collaboration demo.

## Stretch (only if time)
Live presence ("Bob is viewing"), per-tender roles (viewer vs editor), an append-only history (multiple events
per row) — all out of scope for v1; the derived feed is enough for the video.

## Constraints
- **Reuse `lib/collaborators.ts`** for every avatar/name — one visual language.
- **Degrade to "you"** when `actor` is null (signed out / frozen / mock) — never break `/showcase` or `/pack`.
- No schema change; keep the PDF proof + mixed-pack surfaces unchanged.
- `npm run build` + `npm run lint` green before pushing.

## Acceptance
A judge watching the video sees two named people on one tender: a Share action, avatars on rows, "Approved by
<name>" per decision, and a live activity feed of the team's actions — all real, persisted, un-forgeable.
