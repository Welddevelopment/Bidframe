# Archived: the waitlist

**Removed from the live landing on 2026-06-30.** Decision: keep **one** focused
conversion — *Book a demo*. The waitlist cannibalised the primary CTA (an easier
off-ramp right next to the high-value action), signalled "not ready yet" when the
product is ready to demo now, and "Book a demo *for later*" already covers the
not-now case. (See comms **J-025**.) Original landing brief §15 had excluded it too.

Kept here so it is a **quick re-add for a launch moment** (Product Hunt, paid ads,
a viral post) where catching low-intent cold traffic would justify a second,
lower-friction CTA.

## What's here (lifts straight back in, no edits needed to these files)
- **`WaitlistForm.tsx`** — the email-capture form: a hidden honeypot field, a
  one-line consent note, posts to `/api/waitlist`, and pushes only the *event* to
  analytics (no email / PII).
- **`route.ts`** — the same-origin `POST /api/waitlist` handler: drops honeypot
  submissions, validates the email, and forwards to `WAITLIST_WEBHOOK` (env) if
  set, otherwise logs the signup.

## To restore (~10 min)
1. Move the files back to their homes:
   - `WaitlistForm.tsx` → `frontend/src/components/landing/WaitlistForm.tsx`
   - `route.ts`         → `frontend/src/app/api/waitlist/route.ts`
2. In `frontend/src/components/landing/Landing.tsx`:
   - re-add `import { WaitlistForm } from "./WaitlistForm";`
   - in the closing ink-band card (the "See it on a tender you already know"
     section), after the `<BookDemoButton location="closing" />`, re-add the "or"
     divider + the "Not ready for a demo?…" line + `<WaitlistForm />`.
     (See this file's git history for the exact JSX block that was removed.)
3. For a durable list, set **`WAITLIST_WEBHOOK`** (a server env var, e.g. a
   Formspree URL) in Vercel; otherwise signups are only logged.
4. `npm run build && npm run lint`, then regenerate the codemap
   (`python scripts/gen_codemap.py`).
