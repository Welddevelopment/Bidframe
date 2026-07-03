# 📤 Pranav — SEND THE OUTREACH (start here when you wake up)

Joel's asleep (was up past 3am). Everything's done and ready — your job this morning is to **send the
39 personalised outreach emails**. Full detail below; it's self-contained, you shouldn't need Joel.

## What's ready
**39 personalised, web-verified cold emails**, one per PERFECT-fit lead, in **`crm/perfect_drafts/`**
(`MT-01-*.md` … `MT-115-*.md`). Each file has:
- a heading `## MT-XX · Firm Name · recipient@email` ← the **send-to address**
- `**Subject:**` … ← the subject line
- the **email body** — everything from `Hi …` down to and including the `Joel · Bidframe` sign-off
- a `_Why this fit:_` note and a `## Verification` block ← **INTERNAL, do NOT send these**

## How to send
1. For each file: send an email **to** the address in its heading, with that **Subject**, and the
   **body** (from `Hi …` through `Joel · Bidframe`). **Do not paste** the `## MT-XX` heading, the
   `_Why this fit:_` line, or the `## Verification` block.
2. **From:** the Bidframe / Joel outreach address (the emails are signed "Joel · Bidframe" and the
   booking link is Joel's, so they must come from Joel's account or a bidframe.org address).
   **⚠️ If you don't have access to that sending account:** do everything else (QA below, ordering,
   queue them up / build a mail-merge) and **message Joel to fire them** — do NOT stall the whole run.
3. Send them out over the morning (not all in one burst — spacing looks less like a blast).

## 10-second QA before each send
- Both links present + correct: booking **https://cal.com/joel-jeon-o29lfr/bidframe** · site
  **https://www.bidframe.org** (this is the LIVE custom domain — verified serving the landing page).
- **⚠️ MT-57 (Hall Aspects Roofing) — CHECK OR SKIP:** its send-to email `info@hallaspects.com` could
  NOT be verified on their site (only a phone/quote form). Confirm it's valid before sending, or skip it.
- These 4 already had unverifiable claims softened/fixed, so they're **fine to send as-is**: MT-40
  (ATCL), MT-08 (DACCS), MT-75 (AJM), MT-115 (InspireGreen). No action needed.
- Every other lead: verified clean (email, named public-sector client, contact name all confirmed).

## Order
1. All **39 PERFECT fits** first (highest reply odds — tiny firm + a named public client).
2. If you have time after, the broader emailable CRM (`crm/leads.csv`, `status = Not contacted /
   verified / High`) — reuse the template in `outreach-demo-day.md`, personalised per row.

## Log it (you own `crm/leads.csv`)
Mark each lead's `status` → contacted (or a simple sent-log) as you go, so nobody double-sends.

## 🔴 MOST IMPORTANT — when a tender comes back
The emails ask each prospect to **send their tender ahead of the call**. The moment one lands,
**flag it to J immediately** (comms board). We hand-prep that tender through Bidframe so the call is a
polished walkthrough of their real document — that's the whole strategy, so don't sit on it.

## Notes
- Tone is deliberately understated (a founder being helpful, light "worth booking today" nudge) — Joel
  tuned it, don't crank the urgency.
- Custom domain `https://www.bidframe.org` is live; the site's demo/landing needs no login or backend.
- Owl logo is restored + on `main` (will show on the next deploy).
