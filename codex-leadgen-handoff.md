# Codex — lead-gen brief (self-contained, paste-ready)

Standalone copy of the live instructions so you don't need to pull the repo to see them. Everything you
need is in this one file. **If in doubt, keep producing verified leads — do not stop and do not wait.**

---

## What Bidframe is (one line)
A tool that reads a UK public-sector tender, instantly flags the pass/fail "deal-breaker" requirements
(miss one and the whole bid is void), and drafts each answer from the bidder's own documents **with a
citation** — nothing invented. We're finding tiny firms who'd be *desperate* for a free 15-min tender read.

## Operating model
Codex **and** Claude each run the **full pipeline independently** — scan for NEW leads → verify →
personalise — so if one runs out of credits the other keeps producing. Resilience, not division of steps.

## The ICP — target the SMALLEST (narrow; be strict)
**Bullseye:** family-owned / owner-operator firms where the **founder is on the tools *and* does the
bidding** — sole traders, husband-and-wife, 2–3 person, small family Ltds. These are *desperate* for a
free tender read: no time, no budget, high stakes.
**Outer bound (include, but not the priority):** up to ~<30 staff. **Smaller is always better.**
Every lead must ALSO:
- **Bid UK public-sector work** occasionally (councils / NHS / schools / housing associations / public
  frameworks) — with public evidence.
- Have a **real, publicly-listed EMAIL** on the firm's own site — **CORE REQUIREMENT: no email → skip.**
- Clearly not afford enterprise bid tools.

**EXCLUDE:** bid consultancies (they're competitors); anything 100+ staff / £m revenue /
"national/largest" / 1,000s of bids / has a procurement team. If it looks big, drop it.

## Goal — no cap
As many genuinely **PERFECT ICP fits** as you can find — **no upper limit.** "10–20" was only a *quality
bar* (a handful of perfect fits beats a long mediocre list), **not a stop signal.** If you can keep
finding perfect fits, keep going until out of credits or Joel says stop.

## Your seams (reduce overlap with Claude)
Claude is working **family-run compliance/maintenance trades, small local care providers, and
owner-operator building/grounds firms.** You take **other** seams:
- small **school ICT / AV / AP-SEND** providers
- **occupational health** SMEs
- **catering / cleaning / waste / grounds** micro-firms
- **transport / driver / minibus** services
- **translation / interpreting** SMEs
- **arboriculture / tree surgery**
- small **surveying / architecture** micro-practices
Dedupe every candidate against existing `crm/leads.csv` firms (by domain + firm name) before adding.

## Hard rules (non-negotiable)
- **Never invent or guess an email, name, or fact.** Only publicly-verifiable info — the firm's own site,
  Companies House, Contracts Finder / Find a Tender, council approved-supplier lists, framework award
  notices. Can't verify the email on the firm's own site (or a trusted directory like the LCA) → don't
  add the firm.
- Reserved ids **`L-0401+`** in `crm/leads.csv`; match the existing column shape exactly;
  `conversion_estimate=High` only for small + clearly-public-sector + emailable.
- Add `crm/drafts/<id>.md` per lead using the same-day free-pilot nudge (template below).
- Booking link (never change it): **https://cal.com/joel-jeon-o29lfr/bidframe**
- **Commit to GitHub every ~10 min** (small, focused). `git pull --rebase` before every push.

## If you hit an unexpected error (NEW)
- **Do not give up.** Wait a few minutes, then try again — and keep doing this. Transient failures
  (rate limits, timeouts, a page that won't load, a dropped tool) are normal; retry rather than stopping.
- If one search seam goes dry (hit rate drops sharply), **switch seams** rather than grinding the same one.
- If something is genuinely, permanently blocked after several retries, log a note in your run file and
  move to the next seam — never let one blocker halt the whole operation.

## Stay autonomous while Joel sleeps (NEW — important)
Joel is asleep and on auto/unattended mode. **Do not get stuck on anything that needs his direct
permission or approval** — no waiting on a prompt, no "should I proceed?" pauses, no actions that would
require him to confirm. If a step would need his sign-off (e.g. actually *sending* emails, spending money,
changing infra, anything outside producing/verifying leads + drafts), **skip it, note it in your run file
for the morning, and carry on finding leads.** Your job overnight is only: find → verify → dedupe →
personalise → commit. Nothing that fires off outbound or costs money without him.

## Nudge template (same-day free-pilot; SME-bidder framing)
Use the person's name only where a public source confirms it; otherwise "Hi there".

```
Subject: <specific pass/fail hook for their public-sector work>

Hi <Name / there>,

You bid <their public-sector work> — where one missed pass/fail requirement can void the whole
submission however strong the rest is.

Bidframe reads the tender and surfaces those deal-breakers first, each linked to its exact clause,
then drafts each answer from your own documents — a citation on every claim, nothing invented.

I'm running free 15-minute live reads today and tomorrow — send me a tender you're bidding and I'll
show you, on the call, exactly what would disqualify it. A couple of slots left; after this week it's
a paid pilot.

Free slot → https://cal.com/joel-jeon-o29lfr/bidframe  ·  or reply with a tender and a time.

Joel, Bidframe
```
