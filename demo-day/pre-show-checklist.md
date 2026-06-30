# Pre-Show Checklist

Two open risks carried over from the comms boards as of the last `STATUS.md` update (2026-06-30, Day 3) —
**resolve or explicitly route around these before the 4th:**

> ⚠️ **J-020 (the pre-bake)** — "run the real LLM extract + autofill once on the demo tenders, commit the
> cached output" was still **OPEN**, requested by Joel, owned by Bobby. Without it, the on-stage run either
> needs a live key or falls back to the heuristic extractor (gating recall 0.0 — do not demo on heuristic).
>
> ⚠️ **`OPENAI_API_KEY` on Render** — also still open, blocked on the organisers per Joel's last comms
> entry (J-026). Same consequence: no key on the deployed API = heuristic only.
>
> **Bottom line:** before rehearsing the live-click version of this run, confirm out loud as a team which
> of these is true: (a) pre-bake committed + served from cache — safe, no live API on stage, or (b) a real
> key is live on Render — safe, but slower/costs money per upload, or (c) neither — **do not run live**,
> use the recorded backup (see [backup-plan.md](backup-plan.md)) instead of the heuristic path.

---

## Mode decision (must be filled before rehearsal)

| Mode | Use when | Who confirms | What P says |
|---|---|---|---|
| **A. Pre-baked default** | Cached real-LLM tender output is committed/served | Bobby + Jawad | "This is the pre-baked run from our real backend pipeline." |
| **B. Live-key stretch** | Render has `OPENAI_API_KEY`, tested today on the demo tender | P + Joel | "This is running live now." |
| **C. Recorded fallback** | No pre-bake and no tested key | Joel | "We are showing the recorded/pre-baked run rather than demoing the heuristic." |

Write the chosen mode here before the final dry run: `A / B / C = ______`.

## Night before

- [ ] Confirm which of (a)/(b)/(c) above is true. Tell the whole team — don't let P or Jawad discover the
      key isn't live mid-handoff on stage.
- [ ] Confirm the **live URLs** are current: Vercel frontend, Render API (`/health` should return
      `{"status": "ok", ...}`). These have moved before — don't trust an old doc, hit them directly.
- [ ] Backend owner check (P): hit `/health`, `GET /tenders`, one `GET /tenders/{id}/requirements` on the
      intended demo tender, and one harmless `PATCH /requirements/{id}` on a non-critical/local tender if
      using live mode. Record the result in `comms/board-backend.md`.
- [ ] Confirm `data/tenders/2013-SPSO-Invitation-to-Tender---Cleaning-Services.pdf` (hero, 13pp) and the
      NHS framework PDF (messy proof, 66pp) are the exact files used in the pre-bake, downloaded locally on
      the demo laptop as a fallback even if the plan is to demo from the hosted site.
- [ ] Record the **backup video** (full run-sheet, no live clicking) if it doesn't already exist — see
      [backup-plan.md](backup-plan.md). Confirm it plays offline, no buffering, from the actual demo laptop.
- [ ] Charge laptop fully; pack the charger anyway.
- [ ] Each person reads their own [cue-cards/](cue-cards/) file once out loud, alone.

## 30 minutes before

- [ ] **Wake Render**: hit `/health` twice, ~10s apart. Free tier sleeps on idle — first request after a
      sleep can take 30–50s. Do this *before* you're in front of judges, not during.
- [ ] If mode B is selected, run one live upload on the actual demo tender now. If it misses the gating
      rows or returns heuristic output, immediately demote to mode A or C.
- [ ] Open and pre-position every tab listed in Jawad's cue card, in order, in the actual presentation
      browser window (not a different one you tested in).
- [ ] Confirm wifi / hotspot fallback. If the venue wifi is shared and congested, prefer a phone hotspot —
      Render cold-start + congested wifi is the single most likely live failure.
- [ ] Mute notifications on the demo laptop (Slack, email, calendar popups, OS update prompts).
- [ ] Set browser zoom so text is readable from the back of the room — test this, don't guess.
- [ ] Do one full dry run of the run-sheet, out loud, with handoffs, on the actual laptop and actual wifi
      you'll use on stage.

## 5 minutes before

- [ ] Re-check `/health` one more time — if it's gone cold again, hit it now.
- [ ] Confirm speaker order and positions (see "Speaker positions" in [run-sheet.md](run-sheet.md)).
- [ ] Agree out loud on the cut order if you run long (see "If a beat runs long" in run-sheet.md) — don't
      decide this live, mid-sentence.
- [ ] One person (suggest Joel) keeps rough time — a phone on silent, screen visible only to the team.

## On stage

- [ ] If a judge offers to upload their own tender live, only accept if path (b) above (real key, tested)
      is confirmed — otherwise politely redirect to the pre-baked SPSO/NHS run and offer the live-upload
      version after, on a non-critical machine. See [backup-plan.md](backup-plan.md).
