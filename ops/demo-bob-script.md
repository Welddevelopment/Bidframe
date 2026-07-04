# Demo video — Bob's parts (the colleague on the collab account)

**This is for whoever plays "Bob" in the demo shoot.** It's your setup, your spoken lines, and your
two live actions — plus the context so you know *why* you're there.

---

## Context — why Bob exists in this demo

The video pitches Bidframe as a **real, working product**, not a mock. Its standout feature is
**live multi-user collaboration**: two people work the *same* tender at the same time, and every
approve / edit / flag / comment is **attributed to who did it, in real time, server-side (so it
can't be faked)** — plus reusable **teams** and per-requirement **comments**.

You can't prove that with one person clicking around. So the shoot uses **two real people on two
machines**:

- **Alice** — signed in as the bid manager, **drives and records her own screen**. She narrates the
  product walkthrough.
- **Bob (you)** — signed in on a **separate account, on your own laptop**, on the **same shared
  tender**. When you approve a row or leave a comment, it lands **live on Alice's recorded screen**,
  stamped *"by Bob"*. That live hand-off is the money shot — it's what makes the collaboration
  undeniable.

You **speak throughout** the video (two voices), but you only **touch the product in Part 4**, where
your live actions are the proof. The rest of the time your voice is a second narrator; Alice controls
what's on screen.

Backend note: this is the live product (Fly backend + real accounts + real persistence + realtime
SSE). Your decisions are genuinely saved and streamed — nothing is staged.

---

## Your setup — before recording

1. On **your own laptop**, open the **new Vercel URL** (the one with realtime + comments — same URL
   Alice is on).
2. Sign in as **Bob**:
   - email: `bob@bidframe.co.uk`
   - password: `bobpw12345`
   - *(throwaway demo account — fine to rotate/delete after the shoot)*
3. Alice adds you to the **"Bidframe — Bid Team"** and shares the tender to the team, so it shows up
   for you. Open it.
4. Land on the tender's **Matrix** and wait. Don't click anything until Part 4.
5. Keep your mic on — you speak from Part 1.

---

## Your spoken lines, by part

Deliver each after Alice's preceding line. Keep it natural — you're the **compliance lead** colleague.

### Part 1 — the problem
> "And it never arrives as one clean PDF. It's a **pack** — the ITT, return forms in **Word**, a
> pricing schedule in **Excel**, a compliance checklist in **CSV**, usually **zipped**."

### Part 2 — deal-breakers across formats
> "That's the first thing I check as compliance lead. This £10m public-liability minimum came out of
> the **Word** return form; this 'price every line or be rejected' rule out of the **Excel** schedule;
> this anti-collusion certificate out of the **CSV**."

> "And the deal-breaker net is **deterministic** — not just the model. On our validated tenders it
> catches **every** disqualifier. The AI reads; it never decides."

### Part 3 — answers from evidence
> "Now the answers. Bidframe drafts them from our **capability documents** — and that just means our
> *own* evidence: our insurance certificates, past case studies, client references, the proof we've
> done this work before."

> "Every drafted answer carries a **receipt** straight back to the document it came from. And where we
> have no evidence, it doesn't make one up — it asks me a direct question instead."

### Part 4 — the live collaboration (⬅ your on-screen moment — see actions below)
> "I've got the insurance line — we hold £10m cover, so I'm approving it."  *(then approve — see below)*

> "This pricing rule I want finance to check — I'll flag it and drop a comment."  *(then flag + comment)*

### Part 5 — the close
> "Answers drafted from our own evidence. A whole team working it together, live — every decision
> attributed."

---

## Your live actions — Part 4 only

Do these **deliberately, with a small pause after each**, so they visibly land on Alice's recorded
screen (that's the whole point).

1. **Approve** the **insurance deal-breaker** (£10m public/employer's liability row) — say your line,
   then click Approve. *(Alice's screen should show "Approved by Bob" appear live.)*
2. **Flag** the **pricing-schedule** deal-breaker, then **add a comment** on that row:
   > "Finance to confirm the annual total before submission."

That's it — two actions. Everything else is voice.

---

## Cues / do-nots

- **Wait for Alice's line, then speak** — don't talk over the screen action.
- In Part 4, **pause ~2 seconds** after each click so the live update registers on camera.
- **Don't refresh or navigate away** mid-take — just approve/flag/comment on the matrix.
- If a live update *doesn't* appear on Alice's screen, stop and re-check you're both on the **same
  tender** and the **new Vercel URL** (realtime only exists there).

Full run-sheet (both roles, timings, pre-flight): see the shoot run-sheet Alice has.
