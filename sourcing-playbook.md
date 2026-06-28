# Tender Sourcing Playbook — Day-1 sprint

> Owned by J (it's a whole-team chore — all four grab a few). Goal: **10–15 real UK public-sector tenders
> with the FULL document pack attached** in an hour, and **confirm ONE downloads + parses cleanly in hour one.**
> Tender PDFs are **never committed** (`.gitignore` blocks them) — share via a drive folder / paste paths locally.

---

## Which portal

| Portal | Use it for | Link |
|---|---|---|
| **Contracts Finder** ⭐ | **Our primary.** England, contracts from £12k up — includes the **below-threshold, SME-suitable** ITTs our niche bids for. Real document packs attached. Filter by keyword / value / industry (CPV) / stage. No account needed to search. | https://www.contractsfinder.service.gov.uk/Search |
| **Find a Tender** | High-value (> ~£139,688) Procurement Act notices. Bigger, heavier packs — good for a "survives a 150-page monster" stress test. | https://www.find-tender.service.gov.uk/Search |
| Public Contracts Scotland / Sell2Wales / eTendersNI | Devolved-nation equivalents if we want variety | (per nation) |

**Start on Contracts Finder.** It matches the SME-bidder niche best (auditable autofill for the long tail
that AutogenAI prices out — see `positioning-and-traction.md`).

## The filter recipe (Contracts Finder)

1. **Stage:** "Open" / live opportunities (so a judge could realistically still act on it; also we want the
   ITT pack, which live opportunities attach).
2. **Keyword** — target our SME segments (run a few):
   `managed IT services` · `facilities management` · `cleaning services` · `catering` · `care services` ·
   `training provider` · `grounds maintenance`. These map to under-tooled, frequent-bidder SMEs.
3. **Value band** — roughly **£100k–£2m**. Big enough to have a real ITT with pass/fail criteria; small
   enough to be SME-scale and text-based (not construction drawings).
4. **Must have documents attached** — open the notice, confirm there's an **ITT / tender pack / SQ**
   download, not just a notice summary. *No attached pack = skip it* (we need the source document).

## What makes a GOOD tender for us (pick for these)

- ✅ **Mostly text**, 30–150 pages (our parsing comfort zone; avoid drawing-heavy construction packs).
- ✅ Has **clear mandatory / pass-fail / selection criteria** (the disqualifier catch needs a real gate).
- ✅ Has an **award-criteria / weighting** section (feeds `criteria_ref` + the "where the marks live" story).
- ✅ A **named, recognisable buyer** (council, NHS trust, university) — good for the demo + traction calls.
- ⚠️ Avoid: image-only scans / pure spreadsheets / packs that are 90% drawings — flag and grab another.

## The hour-one parse check (critical — de-risks the whole engine)

The moment we have one pack: **backend runs it through PyMuPDF** and confirms text + accurate page numbers
come out. If the first one is an image-only scan that needs OCR, **grab another** — don't burn the day on a
pathological PDF. Post the result on the comms board (`@all`, INFO/BLOCKER).

## The demo set we're curating toward (by Day 4)

- **1 hero tender** — clean, text-based, has an obvious gating requirement, runs flawlessly. The live-demo star.
- **2–3 "ugly" tenders** — tables, multi-column, dense — proof it survives the messy real world (the 35%).
- **Everyone's gold-set label** — each person hand-labels ONE end-to-end by EOD Day 2 (4 labelled tenders).

## Sharing (without committing PDFs)

Create a shared drive folder "Bidframe — tenders". Drop the PDFs there + a one-line note per tender
(buyer, pages, has-gating?, clean-or-ugly). Keep the *files* out of git; keep the *list* in the drive.

### Changelog
- **2026-06-28 (Day 1)** — v1 by J. Portals + filter recipe + good-tender criteria + hour-one check.
