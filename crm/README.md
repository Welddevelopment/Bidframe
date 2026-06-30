# Bidframe Sales CRM

> Owned by J (traction). The working lead list for outreach. `leads.csv` is the data;
> this file explains the columns, the scoring, and how to keep it honest.
> Strategy / templates / objection-handling live in [`../traction-research.md`](../traction-research.md)
> and [`../traction-outreach.md`](../traction-outreach.md). **This is the operational log** — who, how
> to reach them, where they are in the funnel.

## Context for this list

- **Heavy SME focus.** We deliberately weight small/solo bidders + small consultancies — they decide
  fast, bid often (value compounds), and enterprise tools price them out.
- **Email-first, because J is currently locked out of LinkedIn.** A findable *public* email (esp. a
  Gmail an owner-operator actually reads) is the most valuable contact field right now. LinkedIn-only
  rows are parked for a teammate who has access (see `comms/board-j.md`).

## The one rule: never fake a contact

**No invented emails, names, or phone numbers — ever.** Only record contact details found on a real
public page, and put that page in `source`. `not_found` is a valid, expected value. An honest row with
no email beats a fabricated one (and protects us from emailing the wrong person). This matches the
dossier's standing rule.

## Columns (`leads.csv`)

| Column | Meaning |
|--------|---------|
| `id` | Stable row id (`L-0001`). |
| `firm` | Company / practice name. |
| `contact_person` | Named individual if publicly known, else `not_found`. |
| `segment` | `Consultancy` or `SME`. |
| `sub_sector` | care / cleaning / catering / it-msp / training / security / grounds / freelance … |
| `region` | UK region/city if known. |
| `size_signal` | Why it's an SME (sole trader, single site, staff count, "founder-led"). |
| `email` | Public email, or `not_found`. **Must be sourced** (see `source`). |
| `email_type` | `gmail` / `domain` / `other` / `none`. |
| `website` | Company site (the place to find a contact form if no email). |
| `linkedin` | Handle if known (for the teammate with LinkedIn access). |
| `phone` | Public phone, or `not_found`. |
| `public_tender` | A council/NHS framework or ITT they bid/won — the doc to demo on. `n/a` for consultancies. |
| `conversion_estimate` | `High` / `Medium` / `Low` — see scoring below. |
| `conversion_rationale` | One line: why that estimate. |
| `source` | URL(s) the email/identity came from. **Required for any real contact datum.** |
| `verification_status` | `verified` (email+identity from a fetched page) / `partial` / `unverified`. |
| `status` | Funnel: `Not contacted` → `Queued` → `Contacted` → `Replied` → `Demo booked` → `Interested` → `Pilot` → `Dead`. |
| `notes` | Anything else (hook, warm-intro path, who's actioning). |

## Conversion scoring (how `conversion_estimate` is set)

Ranked for **decides-fast × bids-often × reachable-NOW**. Because of the LinkedIn lockout, reachability
is email-weighted:

- **High** — small/solo, bids often into public frameworks, **and has a findable public email** (Gmail
  best — an owner who reads their own inbox). One conversation can convert.
- **Medium** — genuine SME bidder, but only a website/contact-form (no direct email), **or** a strong
  target that is currently LinkedIn-only (needs the teammate with access).
- **Low** — larger/slower org, or no usable contact path found yet.

Sort the CSV by `conversion_estimate` (High→Low), then by `email_type` (gmail first). The first-wave
shortlist is every `High` row with a `gmail`/`domain` email and `status = Not contacted`.

## Provenance of the current rows

- **Seed (`L-0001`…):** the ~50 named firms/people already researched in `traction-research.md`
  (consultancies + named SME bidders by sector). Most are LinkedIn-sourced, so many `email = not_found`
  — these are the rows a LinkedIn-enabled teammate can enrich fastest.
- **Expansion rows:** added by sector research passes (care, cleaning, catering, IT/MSP, training,
  security, grounds, freelance consultancies). Each carries its `source` URL and `verification_status`.

> Keep it honest as you work it: only promote `status` on real signal, and label interest ≠ pilot ≠
> paid (an ex-Palantir judge will probe inflation).
