# Demo Claim Ledger — every pitch claim, its source, and who defends it

> J-owned deliverable from Jawad's `pitchimprovements.md` (the "Demo Claim Ledger" + "Eval field-note
> appendix" + "Source markers" items). Purpose: nobody overclaims under stage adrenaline, and every
> number in the deck can be defended in Q&A in one sentence. Frontend mechanics from those notes stay
> with Jawad — this is only the proof-wording/defensibility side.

## How to use
Each claim below has: **what we say · the source · who defends it · confidence.** If a claim isn't in
this ledger, don't put it on stage. If you're unsure of a number live, downgrade to the safe wording
in the last column rather than guess.

---

## A. Product claims (what it does) — all safe, shown live in the demo
| Claim | Source / where it's true | Defender | Note |
|---|---|---|---|
| Turns a tender into a checkable matrix, deal-breakers first | The product; the `/demo` SPSO run shows it | Joel / Jawad | Show, don't assert |
| Every requirement traces to its exact source clause + page | Schema: `source_clause`, `source_page`, `source_excerpt`; PDF bounding boxes via `source_rect` (B-015) | Joel / Backend | Click a row → source peek |
| Answers drafted only where there's citable evidence; confidence is visible; low-confidence flagged for review | Schema: `answer.state` / `evidence_refs` / `confidence` + `open_questions` | Joel / Generalist | This is the "asks, doesn't guess" trust point |
| It asks the user instead of guessing | `open_questions` are surfaced when evidence is missing | Joel | Core differentiator vs "AI slop" |

## B. Accuracy / eval claims — the ones judges will probe. Say these EXACTLY.
| Claim | Source (reproducible) | Defender | Confidence |
|---|---|---|---|
| **Deal-breaker catch: 12/12** across our SPSO + museum gold tenders, caught **deterministically without the model** | `scratchpad/net_alone_floor.py` (verified 2026-07-03); gold sets `spso-cleaning.labels.csv` (2 gates) + `museum-cleaning.labels.csv` (10 gates); the generous keyword net catches all 12 with no LLM | Joel / Generalist | **HIGH** — deterministic, re-runnable |
| **Held-out Bradwell: 10/10** deal-breakers (first real unseen test) | `progress.md` B-017 (7/10→10/10); `bradwell-grounds.labels.csv` | Generalist / Backend | **HIGH** |
| **Held-out Duffield: 0 deal-breakers missed** | `progress.md` B-021 (recall .58, "0 dangerous misses"); `duffield-grounds.labels.csv` | Generalist | **HIGH** on the gating subset |
| **101/101** on a worst-case phrasing bank | `scratchpad/megabank.py` (verified 2026-07-03) — `_STRONG` regex vs 101 synthetic deal-breaker wordings | Joel / Generalist | **HIGH — but say "synthetic," it's adversarial phrasings we authored, not real tenders** |
| "Every deal-breaker across four sample tenders, including unseen ones" | Sum of the four rows above (SPSO 2/2, museum 10/10, Bradwell 10/10 held-out, Duffield 0-missed held-out) | Joel / Generalist | **HIGH — for deal-breakers only. Do NOT extend to "every requirement."** |
| Broader ordinary-requirement recall / precision | ~0.65 lexical / ~0.75 semantic-true recall; precision looks ~0.20 but is a **sparse-gold artifact** (only 5 true junk of ~586 flagged) — see comms **J-077**; harness `build_cache.py` / `recall_diag.py` | Joel / Generalist | **Do NOT headline a %.** Safe wording below. |

**Safe wording if pushed on overall accuracy:** *"The strong, validated number is deal-breaker catch —
that's what a bid can't afford to miss, and we've proven it on gold and unseen tenders. Broader
requirement recall is promising but still small-sample, so we don't put a headline percentage on it."*

## C. Market claims — VERIFY before stage (these are NOT our measured numbers)
| Claim | Source in deck | Status |
|---|---|---|
| UK public procurement ≈ £341bn | House of Commons Library (deck cites CBP-9317) | **VERIFY exact figure + year vs the source.** If unsure live, say "hundreds of billions a year." |
| SMEs get "about a third of spend" | — | This is closer to a **government target (~33%)** than an achieved figure. Frame as a *goal* the policy is pushing, not a current share. |
| New rules live since 24 Feb 2025 (Procurement Act 2023) | gov.uk | **HIGH** — the Act went live 24 Feb 2025. Safe to state. |

---

## Ready-to-use: Eval field-note appendix (drop-in slide copy for Jawad)
> Appendix / Q&A slide, not main flow. Use when a judge asks "how do you know it works?"

**Heading:** How we know it works

- **Deal-breakers: 12/12** across our SPSO + museum gold tenders — caught *deterministically, without the model*, so it's guaranteed on these, not luck.
- **Unseen tenders held up:** Bradwell **10/10** deal-breakers; Duffield **0 missed**.
- **Worst case:** **101/101** on a synthetic bank of deal-breaker wordings built to dodge our keywords.
- **Honestly:** broader ordinary-requirement recall and precision are promising but still small-sample — we don't headline a number we can't yet stand behind.

*Source line (small): SPSO · museum · Bradwell · Duffield gold sets; all reproducible via our eval harness.*

## Ready-to-use: Source markers (for the "source marker" item)
- £341bn figure → mono marker: `Source: House of Commons Library` (confirm the CBP number/year first).
- Procurement Act date → `Procurement Act 2023, in force 24 Feb 2025 (gov.uk)`.
- Eval numbers → `Bidframe eval harness, gold sets SPSO/museum/Bradwell/Duffield`.

## Ask-slide copy (J owns this) — suggestion
Current CTA reads a little soft ("Talk to us if you would like to help…"). Sharper option, same primary
CTA (`bidframe.org`, which the QR encodes; `/demo` secondary):
- **Heading:** Help us make public work winnable for small firms.
- **Line:** We're looking for design partners and pilots to make Bidframe the default first read for public-sector bids.
- **CTA:** `bidframe.org` — scan to see the demo · book a pilot.
Keep the short URL in mono beside the QR for screen-photo clarity.

## Final narrative call (J)
Lead with the **deal-breaker guarantee** (12/12 deterministic + held-out) — it's our most defensible,
most differentiated claim. Let precision be an *honesty* point, never a headline. Everything traces to
source; the human stays in control. That's the whole story: fast, but trustworthy.

---
### Do NOT say (overclaim guardrails)
- ❌ "100% accurate" / "never misses anything." ✅ "Catches every **deal-breaker** on our tested tenders."
- ❌ A headline recall/precision % for *all* requirements. ✅ The deal-breaker numbers + the honest caveat.
- ❌ Imply the 101/101 bank is real tenders. ✅ "A synthetic worst-case phrasing bank."
- ❌ A market figure you can't cite. ✅ "Hundreds of billions a year in UK public procurement."
