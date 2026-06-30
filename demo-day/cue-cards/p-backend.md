# Cue Card — P (Backend: ingest, chunk, extract, classify, graph, REST API)

You drive the opening action beat — the moment the product first does something. Keep it brisk; this is
the "watch it work" beat, not the trust beat (that's Bobby and Jawad's job next).
Full timeline: [../run-sheet.md](../run-sheet.md).

## Your beat

### UPLOAD → MATRIX POPULATES — 0:15–0:35
**Screen:** `/review` (or `/upload`). Jawad is driving — you narrate while he drags the file in.
**Point at:** the dropzone, then the row count climbing as the matrix fills.

> "We drop in a real public-sector tender — [SPSO Cleaning Services ITT, 13 pages, the clean hero case].
> For stage reliability this is the pre-baked run from our real backend pipeline: PDF ingest, chunking,
> extraction, classification, reconcile, and API response. The important bit is the shape of the output:
> every requirement pulled out, scored, and sitting in the matrix."

**Only use this alternate line if the Render key is live and tested that day:**
> "This is running live now: ingest, chunk, extract, classify, reconcile, then return the API response.
> It takes a few seconds because it is reading the PDF, not replaying a slide."

**Handoff line:** *"And here's the bit that matters most."* → Bobby steps in at the gating banner.

> ⚠️ **Flag before you rehearse this:** the locked `demo-narrative.md` draft says "137 pages" in this
> beat, but the locked hero tender everywhere else in `STATUS.md` is **SPSO, 13pp** (messy proof is the
> NHS framework, 66pp). Use the bracketed numbers above unless the team explicitly re-confirms 137 is a
> different, intentional opening tender. Worth a 30-second team check before the 4th — don't let this be
> the one number that contradicts itself on stage.

## If asked about your lane

- **"Are we watching a live model call or cached data?"** → answer plainly: the default stage path is
  cached output from a real prior run because the public Render key is not something to gamble with on
  stage. The live backend path is the same shape and can be shown after the pitch if the key is live.
- **"What if the PDF is scanned / a table-heavy mess?"** → you own OCR flagging + graceful failure
  (corrupt/encrypted/empty PDFs return a clean 422, never a crash — Day-4 hardening, `B-004`). You can
  also speak to the **7/7 ugliest real tenders surviving ingest→extract→reconcile→autofill** (incl. a
  66pp NHS framework, 472 requirements, no crash) — that's the generalist's eval number but your pipeline
  is what it's testing.
- **"How does extraction actually work — is it just one big LLM call?"** → chunk → extract → classify,
  pluggable extractor (heuristic with no key, OpenAI/Claude when a key is set). You can go as deep as the
  room wants here; this is your spine.
- **"What happens with a huge file?"** → 50MB cap, clean 413 rejection, won't crash the server.
- **"What does the API actually expose?"** → six demo-relevant endpoints: `/health`, `GET /tenders`,
  upload, get requirements, draft answers, and patch requirement decisions. The UI can swap mock and live
  data without changing the schema.

## Watch for

- This beat is about momentum, not detail — three sentences, then hand off. Resist the urge to explain
  the pipeline architecture here; save depth for Q&A.
- If Render is cold (free tier sleeps on idle), the upload will visibly hang for ~30–50s. See
  [../pre-show-checklist.md](../pre-show-checklist.md) — someone should "wake" it before you're on stage.
