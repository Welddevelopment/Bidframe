# Pranav — Demo-section brief (the live 2-min walkthrough)

> **STATUS: SOURCE OF TRUTH for the DEMO section under today's role split.** Pranav is scripting the live
> demo (his + Joel's part). This pulls together the one thing that's scattered across five files: the
> current beats, the locked numbers, the deck changes that affect the handoff, and the *new* speaking
> split. Everything you need to write your lines is here; §7 points to the deeper files if you want them.
>
> ⚠️ **Why this exists:** three older scripts (`pitch-run-of-show.md`, `demo/pitch-script.md`,
> `demo-day/speaker-notes-2026-07-04.md`) each show a **different** speaking split, and **none matches
> today's.** Use *this* for the demo section; sync the deck timing with Bobby/Jawad (§3).

---

## 1. Today's split (the current truth — supersedes the older scripts)

| Block | Who | What |
|---|---|---|
| **Pitch deck** (~3 min, 6 slides on `/pitch`) | **Bobby + Jawad** | Problem → Use Case → Solution → Product → **Competitors (new)** → Ask |
| **Live demo** (~2 min on `/showcase`) | **Joel (drives + speaks) + Pranav (speaks)** | The frozen Bradwell walkthrough — this is your section |

- **Joel is at the keyboard** the whole demo (he controls the screen). You speak from beside it and point.
- Total target **~5:00**. Your section is **~2:00**. Lead with **control + slow-process-made-fast** (the
  Conduct brief); SMEs are the beachhead we *start* from, not the headline — keep "small firms
  underserved" for Q&A (per `speaker-notes-2026-07-04.md`).

---

## 2. Your section = the demo. Proposed Joel/Pranav beat split

The demo runs on **`/showcase`** (frozen **Bradwell** grounds-maintenance ITT, 34pp, 12 deal-breakers —
cached output of a real pipeline run, no live key on stage). Suggested division — **Joel owns the driving
+ first-person control voice; you own the engineering proof + the numbers** (they're yours as backend).
Adjust with Joel, but this plays to both your strengths:

| ~Time | Beat | Screen action (Joel drives) | Who speaks |
|---|---|---|---|
| 0:00–0:15 | **Frame the control model** | Point at the **ControlPanel** strip (read N pages → found N reqs → flagged N deal-breakers → drafted N → left N; tally = **0 approved**) | **Joel** — "Zero approved. Nothing decided or submitted. I'm at the wheel." |
| 0:15–0:35 | **Deal-breakers first (the catch)** | The oxblood GatingHero wall — 12 pinned at the top | **Pranav** — intro the catch + the number (§4) |
| 0:35–1:00 | **Source proof (must land)** | Click insurance row → **"See it in the document"** → real PDF, exact line highlighted green; then the **page-31 pricing landmine** | **Joel** — "Never take our word for it — the proof is in *their* document, not our dashboard." |
| 1:00–1:25 | **The numbers (engineered, not hoped)** | Stay on the matrix / answer beat | **Pranav** — the held-out eval numbers (§4), say them exactly |
| 1:25–1:45 | **Evidence-backed answer + open question** | Insurance row → drafted answer + citation chip; references row → the **open question** | **Joel** — "Where it couldn't back an answer, it asked me instead of guessing." |
| 1:45–2:00 | **Control beat + land it** | Approve a deal-breaker → **type CONFIRM**; edit one; flag one; point back at the tally | **Joel** (first person) — "It won't let me rubber-stamp a bid-killer — I sign for it. Every decision's captured. I'm at the wheel." → hand back to the deck team for the Ask |

**Your two speaking beats, Pranav:** the **catch intro** (0:15) and the **numbers** (1:00). Everything
else is Joel driving + narrating. If you'd rather also take the source-proof narration while Joel just
clicks, that works too — agree it in one rehearsal.

**Never cut** the source-proof click or the control beat (they're the two moments that must land). If
short on time, cut the second half of the numbers, not the proof click.

---

## 3. What changed in the pitch deck (so your handoff lines up)

- **A 6th main slide was added: "Competitors"** (a named 5-camp comparison — AutogenAI, mytender.io,
  Loopio, Constructionline X-Ray, NotebookLM — with the price/accessibility wedge). Full spec in
  **`pitch-competitor-analysis.md`**. It's **Bobby + Jawad's** to build/present — not your section — but
  it means:
  - The deck is now **6 slides, not 5**, and the rehearsed **170s timing (24/30/40/46/30) is broken** —
    it's being re-summed to fit ≤3:00 (options in `pitch-competitor-analysis.md` §2). **The deck total
    stays ~3 min, so your 2-min demo window is unchanged.**
  - **The exact slide you're handed the mic after is Bobby/Jawad's call** — historically the demo sits
    right after the **Product** slide, then the deck resumes for the **Ask** close (a "sandwich"). With
    the new Competitors slide, confirm with Bobby/Jawad whether the demo still lands after Product, or
    after Competitors. **Either way your beats don't change — only the in/out cue does.** Nail down one
    clean hand-in line and one hand-back line with them in rehearsal.
- **The `/showcase` surface itself is unchanged** — frozen Bradwell, ControlPanel, source-proof button
  all as-is. Your demo doesn't depend on the deck edit.

---

## 4. The numbers — SAY THESE EXACTLY (source: `demo-claim-ledger.md` §B)

Your credibility beat. All reproducible via the eval harness; all deterministic-or-held-out, no headline %.

- **"12 out of 12 deal-breakers across our SPSO and museum gold tenders — caught deterministically,
  without the model."** *(reproduce live: `python -m engine.scripts.net_floor`)*
- **"26 out of 26 hand-labelled disqualifiers across all four validated gold sets"** (SPSO 2, museum 10,
  Bradwell 10 held-out, Duffield 4 held-out) — if you want the bigger headline instead of 12/12.
- **"Bradwell was our held-out test — the pipeline had never seen it, and it caught all 10 deal-breakers."**
- **"Duffield, also held out: zero deal-breakers missed."**
- **"101 out of 101 on a synthetic, worst-case phrasing bank"** — **say "synthetic"** (adversarial
  wordings we authored, not real tenders).
- **"The drafted answers never bluff — 42 of 42 citations verified on our full eval run, zero
  fabrications."** *(the 42/42 was the SPSO run — "our full eval run" is the honest wording.)*
- **Speed:** *"the first read — days down to minutes."* (Backed by: outsourced review from **£950**;
  in-house first read **1–2 days ~£375–750**; a full bid averages **~£4,000 / 2–8 weeks** and one missed
  deal-breaker bins all of it.)

**Do NOT say:** "100% accurate" · "never misses anything" · a headline recall/precision % for *all*
requirements · that the 101-bank is real tenders · "we save you £4,000" (that's what we *protect*).
**Safe wording if pushed on overall accuracy:** *"The strong, validated number is deal-breaker catch —
proven on gold and unseen tenders. Broader requirement recall is promising but still small-sample, so we
don't headline a percentage."*

---

## 5. Honesty + stage rules (don't trip these)

- **Pre-baked, not live:** on stage it's cached output of a real pipeline run. **Don't** say "the model
  is running live" or imply the stage is spending an API call. Say: *"cached output from the same ingest →
  chunk → extract → reconcile → autofill pipeline — frozen so it doesn't depend on venue wifi."*
- **"Pilots," never "customers."** We have an outreach pipeline + conversations starting — not signed users.
- **If a number's challenged:** *"every claim on this stage is in our claim ledger with its source — happy
  to walk any of them after."* Then continue.
- **If `/showcase` misbehaves:** fall back to `/demo` (guided version, same frozen Bradwell) — see
  `demo-day/backup-plan.md`.

---

## 6. Q&A you (backend) will likely field

- **"Is this just a prompt wrapper?"** → *"No — PDF ingest, chunking, extraction, reconcile/dedupe, a
  deterministic deal-breaker net, source rectangles, evidence-grounded drafting, persistence, tests, and
  an eval harness. It's a trust layer, not a PDF chatbot."*
- **"What if the AI is wrong?"** → *"The human reviews every row; deal-breakers need explicit confirm;
  low-confidence is marked; missing evidence becomes an open question, not a fabricated answer."*
- **"Can it handle messy PDFs?"** → *"Yes, within bounded cost: multiple parsers, table recovery,
  sparse-page detection, OCR fallback via vision, chunk retries, graceful failure — long scanned tenders
  past the cap are flagged, not silently dropped."*
- **"Why public sector first?"** → *"The deal-breaker taxonomy is finite enough to make reliability
  measurable, and small firms are underserved by existing bid tooling."*

---

## 7. The files behind this (read if you want depth — but §1–6 is enough to script)

- **`control-demo-script.md`** — the exact clicks + narration for the control beat (named-confirm, edit,
  flag, open question). Your 1:45 beat in detail.
- **`demo-day/speaker-notes-2026-07-04.md`** — today's presenter sheet: the product-walkthrough exact
  order (steps 1–13), the control-beat script, safe numbers, Q&A. *(Its speaker column predates today's
  split — trust §1–2 here for who-speaks-what.)*
- **`demo-claim-ledger.md`** — every claim → source → defender → safe wording. The authority for §4.
- **`demo-day/run-sheet.md`** — the older beat-by-beat (4-person demo); useful for the beat *content*, not
  the current speaker assignment.
- **`pitch-competitor-analysis.md`** — the new Competitors slide spec (Bobby/Jawad's, affects deck timing).
- **`demo-day/backup-plan.md`** — fallbacks if `/showcase` fails.
- **Bobby's demo pack:** `demo/` (strategy, run-of-show, pitch-script, q-and-a-battlecard, final-checklist).

---

## 8. Open items to confirm in rehearsal (don't guess these solo)

1. **The in/out cue with Bobby/Jawad** — which deck slide hands to you+Joel, and which slide the deck
   resumes on for the Ask (§3). One clean hand-in line, one hand-back line.
2. **The Joel/Pranav beat split** (§2) — confirm you take the catch-intro + the numbers, Joel takes
   framing + proof-click + control. 5 minutes of rehearsal settles it.
3. **Final deck timing** after the 6th slide (Bobby/Jawad own it) — just verify it leaves your 2:00 intact.
