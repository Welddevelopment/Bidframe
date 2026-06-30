# Cue Card — Bobby (Generalist: reconcile/dedupe, confidence routing, eval harness, answer-draft)

You carry the **numbers** — every honest, verified figure in this demo is yours to own and defend. You
have two solo beats and one shared beat. Full timeline: [../run-sheet.md](../run-sheet.md).

## Your beats

### 1. THE CATCH (hero moment) — 0:35–0:55
**Screen:** the gating "deal-breaker" banner (oxblood). **Point directly at it** — don't let eyes wander.

> "This one's a pass/fail gate. Miss it, you're disqualified — and it's the first thing you see, not
> buried on page 61. On this tender we caught **every disqualifier**, measured against a hand-labelled
> answer key: **gating recall 1.0, zero dangerous misses.** That's not a vibe, it's a number from our own
> eval harness, including an adversarial test suite built specifically to try to break that claim."

**Handoff:** *"Don't take our word for it."* → Jawad clicks the row.

### 2. THE FLAG (honesty) — 1:15–1:35
**Screen:** an amber/lower-confidence row, the confidence bead.

> "Where we're not confident, we flag it instead of guessing. That threshold is calibrated against real
> hand-labelled tenders, not a guess — it's the same honesty that drives the gating catch. The flag isn't
> a weakness we're hiding, it's the proof we're not bluffing."

**Handoff:** *"And it doesn't stop at reading — it drafts your response too."*

### 3. AUTOFILL TRUST NUMBER (shared with Jawad) — inside 1:35–2:05
Jawad drives `/answers` and talks UI; you land the number right after:

> "And it never bluffs. We built a groundedness check specifically to catch fabricated citations — on
> this tender, 42 out of 42 citations verified, zero bluffs. Where it genuinely can't answer from your
> documents, it doesn't guess — it asks. A handful of questions, not a blank page."

## The numbers, exactly as locked (don't round these up)

- **Gating recall: 1.0** (every disqualifier caught and flagged).
- **Dangerous misses: 0.**
- **Bluffs: 0** (42/42 citations verified grounded).
- **Robustness: 7/7** of the ugliest real tenders survive end-to-end (incl. 66pp NHS, 472 reqs — no crash).
- **Overall extraction recall: ~0.79–0.95**, run-to-run (gpt-4o noise). **Quote the disqualifier catch and
  groundedness, never this number alone** — it's the one figure in the deck that isn't stable, and a sharp
  judge will notice if you lean on it.

## If asked about your lane

- **"How do you know 1.0 / 0 / 0 are real and not cherry-picked?"** → the eval harness is deterministic
  (no LLM judge marking its own homework), scored against hand-labelled gold sets per tender, *and* there's
  an 18-test adversarial suite specifically trying to break each of the four trust claims (conservative
  merge never mis-merges, gating status never silently downgrades, autofill can't bluff past the
  groundedness detector, the eval itself can't hide a missed disqualifier).
- **"What's reconcile/dedupe actually doing?"** → conservative AND-gate merge (text similarity + token
  overlap + same page + same clause) so near-duplicate requirements from different chunks collapse into
  one, but genuinely distinct requirements never silently merge — a wrong merge is a silent miss, so it
  errs toward keeping things separate.
- **"What's the one honest limitation?"** → reconcile is lexical, so two distinct requirements that share
  the *exact same page and clause* could in theory merge — mitigated by the clause AND-gate, documented,
  not yet hit in testing. Say this if asked; it's a strength (you tested for it), not a weakness to hide.

## Watch for

- These two solo beats are short and number-dense — don't rush them flat. Land the number, pause half a
  beat, then hand off.
- If a judge interrupts mid-number with a follow-up, finish the number first, then take the question —
  don't let "1.0" get lost in a tangent.
