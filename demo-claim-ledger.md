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
| **Deal-breaker catch: 12/12** across our SPSO + museum gold tenders, caught **deterministically without the model** | **`python -m engine.scripts.net_floor`** (committed, offline, no key — reproduces it live); gold sets `spso-cleaning.labels.csv` (2 gates) + `museum-cleaning.labels.csv` (10 gates); the generous keyword net catches all 12 with no LLM | Joel / Generalist | **HIGH** — deterministic, re-runnable |
| **26/26** hand-labelled disqualifiers across **all 4 validated gold sets** (SPSO 2, museum 10, Bradwell 10 held-out, Duffield 4 held-out), no model | **`python -m engine.scripts.net_floor`** → prints `26/26` (excludes the in-progress WLWA gold, same as `eval_all`); surfaced in the README proof section | Joel / Generalist | **HIGH** — the reproducible headline of the four rows below |
| **Held-out Bradwell: 10/10** deal-breakers (first real unseen test) | `progress.md` B-017 (7/10→10/10); `bradwell-grounds.labels.csv` | Generalist / Backend | **HIGH** |
| **Held-out Duffield: 0 deal-breakers missed** | `progress.md` B-021 (recall .58, "0 dangerous misses"); `duffield-grounds.labels.csv` | Generalist | **HIGH** on the gating subset |
| **101/101** on a worst-case phrasing bank | `scratchpad/megabank.py` (verified 2026-07-03) — `_STRONG` regex vs 101 synthetic deal-breaker wordings | Joel / Generalist | **HIGH — but say "synthetic," it's adversarial phrasings we authored, not real tenders** |
| "Every deal-breaker across four sample tenders, including unseen ones" | Sum of the four rows above (SPSO 2/2, museum 10/10, Bradwell 10/10 held-out, Duffield 0-missed held-out) | Joel / Generalist | **HIGH — for deal-breakers only. Do NOT extend to "every requirement."** |
| Broader ordinary-requirement recall / precision | ~0.65 lexical / ~0.75 semantic-true recall; precision looks ~0.20 but is a **sparse-gold artifact** (only 5 true junk of ~586 flagged) — see comms **J-077**; harness `build_cache.py` / `recall_diag.py` | Joel / Generalist | **Do NOT headline a %.** Safe wording below. |

**Safe wording if pushed on overall accuracy:** *"The strong, validated number is deal-breaker catch —
that's what a bid can't afford to miss, and we've proven it on gold and unseen tenders. Broader
requirement recall is promising but still small-sample, so we don't put a headline percentage on it."*

## C. Market claims — VERIFIED (checked 2026-07-04 against the House of Commons Library)
| Claim | Status |
|---|---|
| UK public procurement ≈ **£341bn** | ✅ **VERIFIED — but say the year: that's the 2023/24 figure** (HoC Library CBP-9317, updated 28 Jul 2025). The **latest is £434bn (2024/25)** — either is fine on stage, but state the year so a judge who knows the newer number doesn't catch you. Safe fallback: "over £340 billion a year." |
| Procurement is **"about a third of spend"** | ✅ **VERIFIED** — "procurement accounts for about a third of public-sector spending" (HoC Library CBP-9317). *(Note: this is procurement's share of public spending — NOT the SME share. Don't conflate it with the SME-participation target.)* |
| New rules live since **24 Feb 2025** (Procurement Act 2023) | ✅ **VERIFIED** — the Act went live 24 Feb 2025 (gov.uk). Safe to state. |

Source: [HoC Library — Procurement statistics: a short guide (CBP-9317)](https://commonslibrary.parliament.uk/research-briefings/cbp-9317/).

## C2. Impact / £-saved claims — the headline speed-up number (Impact, 30%)
> On the deck's Use Case slide: **"Weeks → minutes"** — read it as **weeks of bid work *at stake*,
> protected by a first read Bidframe does in minutes**, NOT "we do weeks of work in minutes." Backed by the
> £ below. Full sourcing in [`incumbent-pricing-research.md`](incumbent-pricing-research.md). Bidframe
> replaces the **first-read layer** (compliance analysis *before* writing) — **not** the whole ghost-written
> bid. Do not claim we replace the bid writer.
>
> ⚠️ **Honesty guardrail for "weeks":** a *bid* is 2–8 weeks of work (row below); the *first read itself* is
> 1–2 days (row below). "Weeks → minutes" compresses the **stakes** (weeks of work one missed clause bins),
> not the task. If a judge asks "weeks for a first read?", answer: *"Weeks is the bid at risk — the first
> read is a day or two by hand, and Bidframe does it in minutes so that weeks-long bid isn't wasted."*
>
> ⏱️ **Future improvement (not done for this demo):** replace the sourced estimate with a real stopwatch
> measurement — time a manual first-read of the Bradwell pack finding all 10 deal-breakers, vs Bidframe's
> real run. Turns the "1–2 days" from an industry estimate into our own measured number.

| Claim | Source | Defender | Confidence |
|---|---|---|---|
| An **outsourced tender first-read starts at £950** | [Glaxtons pricing](https://www.glaxtons.co.uk/pricing/) | Joel | **HIGH** — published price |
| Done in-house the first read is **1–2 days of a bid writer (~£375–£750)** at the **£375/day** median | [IT Jobs Watch — Bid Writer](https://www.itjobswatch.co.uk/contracts/uk/bid%20writer.do) | Joel | **HIGH** |
| A **full bid averages ~£4,000 and takes 2–8 weeks** — and **one missed deal-breaker bins all of it** | [Executive Compass](https://executivecompass.co.uk/blog/bid-management/what-is-the-cost-of-writing-a-tender/) | Joel | **HIGH** |
| **Headline: "Weeks → minutes"** — a bid is weeks of work that one missed clause bins; Bidframe does the first read (where the bid-killers hide) in minutes | Composite of the three rows above + the live `/showcase` run | Joel / Bobby | **HIGH — "weeks" = the bid at stake, NOT the first-read time (that's 1–2 days). Never claim we do weeks of work in minutes.** |

**Safe wording if pushed on ROI:** *"Directly, £400–£950 per tender on the first read, in minutes instead
of a day or two. But the real number is not wasting a £4,000, multi-week bid on a deal-breaker you missed
on page 31."* Do **not** say "we save you £4,000" — that figure is what we *protect*, not what we replace.

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
