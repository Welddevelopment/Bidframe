# Bidframe — UI/UX design uplift (2026-07-01)

**Status:** implemented + build/lint green + eyeballed on `/demo` + `/thank-you`. Committed on branch
`claude/strange-ptolemy-9f573c` (commit `442c7a2`). **NOT yet on `main`** — pending @j/@jawad ack on the
locked oxblood token, then merge. Directed by the Generalist (Bobby); cross-lane into `/frontend`. Comms: **G-027**.

**Guiding principle — dynamic range:** the deal-breaker is the one place the calm Civic-Record palette breaks
into a genuine alarm; completion is the one place it celebrates. Everywhere else stays quiet.

## What shipped

### A · Deal-breaker alarm  *(touches a LOCKED design token — keep code + docs atomic)*
- `signal-oxblood` retuned **`#8A2D2A` → `#B42D24`** — a truer alarm red on the warm `#F6F2E9` paper.
- New sibling token **`--color-signal-oxblood-frame: #8A2D2A`**, scoped to **edges/borders only**. This is a
  deliberate **fill/frame two-tone**: bright `#B42D24` on *fills and marks* (bead, dot, status word), deep
  `#8A2D2A` on *reading edges* (the 7 `border-*` usages were switched to `-frame`). Do not collapse them back.
- The "Can't answer this" (oxblood) confidence bead is now **full-fill (`TIER_FILL.oxblood 30 → 100`) + a bold
  paper `!` glyph** — it was a 30%-fill bead that read like a "low battery". `TIER_HEX.oxblood` is a hardcoded
  hex independent of the CSS var, so **both must change together** (`ConfidenceIndicator.tsx`).
- `GatingHero`: dots 10→11px (ring `.35`→`.5`), left spine 2px→**3px** in the `-frame` tone.
- Greyscale test holds: oxblood (now full, like light-green) is disambiguated by the `!` glyph + its word.
- **Files (one atomic commit):** `src/app/globals.css`, `src/components/ConfidenceIndicator.tsx`,
  `src/components/GatingHero.tsx`, the 7 edge usages (`ComplianceMatrix`, `GraphView` ×2, `login`, `Landing`,
  `RequirementsContext`), and the synced swatch docs `design/colours.html` + `DESIGN-SYSTEM.md` +
  `design-language.md`.

### B · Win moment (completion payoff)
- `MatrixView.tsx` `CompletionSummary` rewritten as a Civic-Record "record filed" sheet: the forest
  `ApprovalStamp` **only when `flagged === 0`** (an open concern gets a quiet ink line instead — stays honest),
  a mono decision tally, and the CSV export as the one forest action. Doubles as the export surface.
- Renders only when `nextPriorityId(requirements) === null` (every requirement decided), so it is not visible
  on the read-only `/demo`; it appears at the end of a real review session. Closes `frontend-ux-audit.md` #8.

### C · Booking return
- Every "Book a demo" CTA opens Cal.com in a **new tab** (`target="_blank" rel="noopener noreferrer"` in
  `BookDemoButton.tsx` + the `login` page link), so the visitor is never stranded.
- New **`/thank-you`** route (`src/app/thank-you/page.tsx`) in the Civic-Record language — the target for
  Cal.com's *Redirect on booking*. Reads no query params (Cal.com's appended params are ignored gracefully),
  valid as a directly-visited URL. **CODEMAP regenerated** for the new route.
- **External step (owner: Joel / the Cal.com account):** set the `bidframe` event's *Advanced → Redirect on
  booking* (`successRedirectUrl`) to `https://<prod-domain>/thank-you`. `.env.example` documents this.

### D · Status column
- The "Needs your eye" wall is gone. New pure helper `pendingStatusWord()` in `lib/triage.ts`; pending rows
  differentiate (first match wins): **null/blank** (confident non-gating — hover Approve owns the cell) ·
  **Deal-breaker to clear** (gating, the one signal-coloured word) · **Needs your answer** (open question) ·
  **Worth a second look** (low-confidence). Decided: "Approved by you" / "Edited by you" / "Flagged".
  Presentational only — no schema change.

## Remaining
1. **@j / @jawad:** ack the locked `signal-oxblood` retune (`#B42D24`), then merge to `main`.
2. **Joel:** the Cal.com *Redirect on booking* step above.
3. **Logo:** the owl/register-seal direction has been replaced by the clause frame. The primary mark is a
   bracketed clause, and the favicon uses the same minimal frame so it stays legible at 16px.
