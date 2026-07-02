# Outreach kit — the same-day "free pilot" nudge

**The mechanic (win either way):** free 15-min live tender reads **today + tomorrow only** create the
urgency and give us live pilots; later slots stay open, framed as a **paid pilot** — so a booking is
*either* a pilot *or* a company that opted in knowing it's paid (commercial validation). Lead with free;
paid-later is the soft catch.

**The core ask** (concrete + same-day-able, beats "book a demo"):
> Send me one tender you're bidding right now and I'll show you what would disqualify you — live, 15 min, today or tomorrow.

---

## Cold email
**Subject (pick one):** `What would disqualify your next bid?` · `Free tender read — today or tomorrow` · `The line that voids the bid, caught first`

> Hi [Name],
>
> Public-sector tenders bury pass/fail requirements — miss one and the bid is void, however strong the rest is.
>
> Bidframe reads the tender and surfaces those deal-breakers first, each linked to its exact clause. On a live [sector] contract it caught every disqualifier and invented nothing.
>
> I'm doing **free 15-minute live reads today and tomorrow** — send a tender you're bidding and I'll show you, on the call, exactly what would disqualify you. A couple of slots left; after this week it's a paid pilot, so if you've a bid in flight it's worth grabbing one.
>
> **Free slot → [BOOKING LINK]**  ·  or just reply with a tender and a time that suits.
>
> [Name], Bidframe

## LinkedIn DM (shorter — higher same-day yield; prioritise this channel)
> Hi [Name] — Bidframe reads a public-sector tender and flags the pass/fail deal-breakers first, each tied to its clause (caught every disqualifier on a live cleaning contract, invented nothing). I'm running **free 15-min live reads today & tomorrow** — send a tender you're bidding and I'll show you what would disqualify you, live. Handful of slots, paid pilot after this week. Worth 15 min? → [BOOKING LINK]

## Follow-up (next morning, no reply)
> Quick nudge, [Name] — the free live reads run **today only** now. If you've a bid in flight, send it over and I'll show you the deal-breakers on a 15-min call. → [BOOKING LINK]

---

## Cal.com setup (makes the free/paid split real)
Two event types (or one link + the copy framing above):
1. **"Free live tender read — this week"** → availability **capped to today + tomorrow**, 15 min. *(→ pilots)*
2. **"Bidframe pilot — 15 min"** → availability **from next week, described as a paid pilot**. *(→ paid-intent signal)*

Point `[BOOKING LINK]` at (1); anyone who can't make it lands on (2). Set `NEXT_PUBLIC_BOOKING_URL` to (1) on Vercel.

## Track (all four = traction for demo day)
`sent · replied · free-booked · paid-booked` — free-booked are live pilots; paid-booked prove commercial intent.

## Guardrails
- **Don't over-lead with "paid"** — free-today/tomorrow is the hero; "paid after this week" is just the clock + fallback.
- **Personalise `[sector]` with a tender you can actually read live** (cleaning / FM / NHS — the prebaked or fast ones), and reference something real about them so it doesn't read as a blast.
- **Be ready to deliver:** demo env pre-loaded (see `go-live-runbook.md`); if they send a tender, have it 30 min ahead so you pre-run it (throttle) and just present.
