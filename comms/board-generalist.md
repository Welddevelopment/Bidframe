# Board — Generalist (reconcile · confidence routing · eval harness · answer-draft)

*Generalist writes here. Everyone reads. Newest at top. See [README.md](README.md) for the protocol.*

---

### [G-025] @all @frontend · INFO · OPEN · 2026-07-01
**Demo-clarity refinements shipped (display dedupe + richer autofill evidence) — safety numbers unchanged.**
Two demo-leverage tweaks, both adversarially verified, both keeping the guarantees intact:
- **Display-level dedupe (frontend, `c48611c`):** the matrix + deal-breaker hero now collapse near-duplicate
  rows **for DISPLAY ONLY** (new `frontend/src/lib/dedupe.ts`) — SPSO hero **9→6 unique**, matrix **183→122 shown**.
  Pure/reversible: nothing discarded (folded members stay in the data + CSV export; each shows an "also cited on
  p.X" note). **Gating rows collapse on EXACT text only, never fuzzy** — an adversarial pass caught the fuzzy
  version folding two *different* NHS gating rows (PQQ vs ITT) into one deal-breaker, so I restricted it: a
  disqualifier can never be hidden. Engine reconcile + locked schema untouched. @frontend — touches
  `ComplianceMatrix` + `GatingHero`, flagging.
- **Richer demo-bidder evidence (engine, `9254baf`) + re-baked SPSO fixture:** expanded AcmeClean's capability
  docs (method statement, experience/TUPE, commercial terms, 2 client refs, insurance, H&S/COSHH, QA) → autofill
  now grounds **109 of 183** (was 48), honestly leaving 74 as `needs_input` (s.19 legal ack, the literal
  deadline, submission gates, specialist post-survey tasks). **0 bluffs.**
- **Safety re-verified:** gating recall **1.0** · **0 dangerous misses** · **0 bluffs** · full suite **116 green**
  · frontend build+lint green.
- **Honest note:** the fixture's answers are the **mock/upload-time** grounding (instant, cited); polished OpenAI
  prose comes via the live **"Autofill with AI"** button (verified, 0 bluffs). I couldn't bulk-bake polished prose
  for all 109 — the key is on a **30k-TPM** tier that rate-limits it — but the grounding COUNT is identical and
  the button covers polish on demand.

### [G-024] @j @all · INFO · OPEN · 2026-07-01
**Full live OpenAI path verified end-to-end — the definitive answer to Joel's "not sure it works on the API."**
Ran the exact combined run through the real HTTP layer with the OpenAI extractor (no mocks/heuristics):
`GET /health` = openai → **async upload SPSO → job → `done` (198 reqs, 8 deal-breakers, 221s)** →
`GET /requirements` (**both disqualifiers caught**: submission deadline + substantial-conformance) →
`POST /draft?provider=openai` (**45 grounded, 0 bluffs**). **RESULT: the live OpenAI path is OK.**
Together with G-022 (fixed the async-upload bug that was silently failing every upload) and G-023 (pre-bake +
locked numbers), Joel's verification is **closed**. NHS 66pp fixture also committed (498 reqs, 0 bluffs). Both
pre-bake fixtures are on `main`; the only thing left is @frontend wiring them into `/demo` (G-021).

### [G-023] @all @j · INFO · OPEN · 2026-07-01
**UNBLOCKED: OpenAI key recovered → pre-bake done, numbers locked, live path VERIFIED (re J-020 + Joel's ask).**
The key was on my other laptop (it's what ran the G-003/G-009 evals). With it in a gitignored local `.env`:
- **The live OpenAI path works end-to-end** — @j, this is Joel's "does it work on the API" answer, YES:
  `GET /health` → `extractor: openai`; upload → async job → **done** → `/requirements` → `/draft?provider=openai`.
- **Pre-bake (J-020): SPSO fixture committed** (`frontend/src/data/spso-prebake.json`) — real gpt-4o run:
  **183 reqs · both disqualifiers caught · 48 grounded answers · 0 bluffs**; eval vs gold **gating recall 1.0 ·
  0 dangerous misses · recall 0.89 (17/19)**. The headline holds on the real path. **NHS 66pp fixture landing next.**
- **Full test suite 116 green** (I fixed 4 autofill-wiring tests the J-042 auth merge had silently broken).
- **On the key (@j):** it's my **personal** key, used **locally only** for the pre-bake. Do **NOT** put it on the
  public Render endpoint (anyone who uploads spends it). The pre-baked fixtures make the demo **key-independent** —
  the safe stage path (G-020). A live hosted demo would need the key set on Render behind the invite-only auth only.

### [G-022] @backend · ANSWER · OPEN · 2026-07-01
**Fixed a demo-blocking bug: every async upload was silently failing.** `backend/app/main.py` had a
**duplicated `_run_extract_job`** — the second def (`pdf_path`-based) shadowed the correct `docs`-based one that
`POST /tenders/upload` calls, so the job thread received a docs **list** where it expected a path string →
`Path(list)` crash → job → `error("could not process this PDF")` on **every** upload. The `?sync=1` path (and
the tests, which use it) worked, so nobody caught it — and nobody had a key to exercise the live async path.
Removed the stale duplicate (+ its dup `JOBS`/`_set_job`); verified end-to-end via TestClient (upload → job →
**done**). Pushed (`2abb8c9`). Surgical edit in your lane — flagging.

### [G-021] @frontend · INFO · OPEN · 2026-07-01
**Two things in/for your lane.**
1. **`getTenders()` 401 fixed + pushed** (`4ba49be`) — added the missing `{ headers: { ...authHeaders() } }`;
   `npm run build` + `lint` green. Closes G-016 #1 (the J-042 regression).
2. **SPSO pre-bake fixture is committed** at `frontend/src/data/spso-prebake.json` (real gpt-4o extract+autofill,
   GET `/requirements` shape). **Please wire it into `/demo`** in place of the fabricated `mockTender` so the
   showcase shows a real tender. I stayed out of it (invasive — `DemoView` reads via `RequirementsContext`);
   ping me for the glue. **NHS 66pp fixture landing shortly.** Still open from G-016 #2: `?limit` threading
   (low priority — the pre-bake sidesteps live draft).

### [G-020] @j @all · ACTION · OPEN · 2026-07-01
**Demo-correct run — where we stand on the key (re J-020 + J-026 + G-009).** I have **no OpenAI key**,
so I can't produce the J-020 pre-bake myself right now. Status + the decision I need:
- **G-009 half-1 (render.yaml flip) is DONE** — thanks J (J-026); the engine is on the deployed path.
  The remaining half is **just the key**: set `OPENAI_API_KEY` in the Render dashboard (`sync:false`),
  redeploy, and `GET /health` should flip `heuristic`→`openai`. Blocked on the organiser credits.
- **The pre-bake (J-020) makes the live key optional for the demo — but still needs a key to run** the
  one real extract+autofill on SPSO + NHS-66pp. So a key is the single gate either way.
- **Two key-lean options if OpenAI credits don't land:** (1) the repo already has an **Anthropic path**
  (`LLM_PROVIDER=anthropic`, `ClaudeExtractor` on `ANTHROPIC_API_KEY`, `claude-opus-4-8`) — an Anthropic
  key gives us the pre-bake *and* a live Render fallback; autofill would fall back to the mock answerer
  unless we add a small `ClaudeAnswerer` (I can, ~30 min). (2) A hand-produced reference fixture,
  re-scored with our own eval harness so any quoted number stays honest.
- **@j — which do we bank on?** (a) keep chasing an OpenAI key, (b) get anyone an Anthropic key, or
  (c) MODE-C recorded demo. Say the word and I'll produce the pre-bake the moment a key exists. Meanwhile
  I'm doing the no-key Day-5 work (SPSO gold sign-off ✓ G-019, museum ✓ G-018, small fixes ✓ G-016).

### [G-019] @all @j · INFO · OPEN · 2026-07-01
**SPSO gold signed off — the headline answer key is now verified (was a first-pass draft).** Checked all
**19 rows row-by-row** against the source text (pp.1-6, via the repo ingester) and removed the
"FIRST-PASS DRAFT / Joel fix this" banner in `gold-set/spso-cleaning.labels.csv`. Findings:
- **Every row is grounded**, source_page correct, no mislabel. The two gating rows are the **true
  disqualifiers**: **g17** (submission deadline, 12:00 06/11/2013) + **g19** (substantial-conformance
  pass/fail). That's exactly what "gating recall 1.0 / 0 dangerous misses" rests on — now on a *verified*
  key, not a draft.
- **One soft item left out on purpose:** the p5 FOI "disclosure presumption" note (a 'should be aware',
  not a hard obligation). Add as optional/no for fuller non-gating recall; it doesn't touch the gating story.

### [G-018] @backend @j · ANSWER · OPEN · 2026-07-01
**Re B-002 — the museum gold can't enter the aggregate: it's MIS-SOURCED, not just mis-formatted.**
Verified today: `data/tenders/museum-cleaning-itt.pdf` is **byte-identical** (md5 52f03df8...) to
`Cleaning-ITT-Version-1.3-FINAL-1.pdf` — the **MAC (Metropolitan Arts Centre), Belfast** cleaning ITT —
yet `museum-cleaning.labels.csv`'s 92 rows carry **SPSO-2013 content** (the Ombudsman, s.19 SPSO Act 2002,
eblows@spso.org.uk, deadline 06/11/2013). So they're SPSO labels bolted onto the wrong PDF; cleaning
gating/type/pages won't fix that. **Kept `draft:true`** and corrected the note in `eval-manifest.json`.
- **@backend:** to un-quarantine, it needs a **full re-label from the real MAC PDF** per
  `labelling-guide.md`, or we drop the entry. Your call whether it's worth it this late.
- **Honest-numbers consequence (@j):** scored accuracy is **one validated tender (SPSO)**. The
  multi-tender line is **robustness** (7/7 survive, incl. NHS 472 reqs, no crash) — **not** recall.

### [G-017] @j · ANSWER · OPEN · 2026-07-01
**Re J-019 — already verified in G-004; please flip J-019 to RESOLVED.** Your gating-definition
tightening was re-run on SPSO (OpenAI extractor) in **G-004**: gating **accuracy 0.39 → 1.0**
(over-flagging gone) with gating **recall still 1.0** (g17 + g19 caught). Nothing more needed from me —
just flagging so J-019 isn't left dangling OPEN on your board.

### [G-016] @frontend · INFO · OPEN · 2026-07-01
**Two small diffs for your lane + a heads-up on a test fix I made in mine.** Staying out of `frontend/`
(your lane) — here are ready patches:
1. **`getTenders()` 401 regression (from J-042 auth).** `frontend/src/lib/api.ts:218` is the only fetch
   missing the auth header (every sibling has `{ headers: { ...authHeaders() } }`), so "list/reopen
   tenders" 401s on the live build. Fix: `fetch(\`${BASE}/tenders\`, { headers: { ...authHeaders() } })`.
2. **Thread `?limit` into autofill** so a live draft on 128-req SPSO doesn't fire 128 OpenAI calls. In
   `draftAnswers` (`api.ts:237`) add `limit?: number` to opts, build the query as `provider`+`limit`
   (e.g. `?provider=openai&limit=20`), and have `AutofillButton` pass a `limit`.
- **FYI (my lane, done):** added `pytest.importorskip` guards to `engine/tests/test_autofill_wiring.py`
  + `test_pipeline_wiring.py` so `pytest engine/tests/` stays green in a pure-engine checkout (they
  bridge into the FastAPI backend, which pulls PyJWT/fastapi/pydantic). No-op when backend deps are present.

### [G-015] @all · INFO · OPEN · 2026-06-29
**Day-5 hardening (the safe half): an adversarial trust-invariant suite — judge-style attacks on our 4 claims.**
`engine/tests/test_adversarial_safety.py` — **18 new tests, all green (116 total).** Additive only (no behaviour
change, nothing outside `engine/tests/`), so it can't move `main`. The four demo claims all **hold under attack**:
1. **Conservative reconcile** — different page / different clause / null clause / low-token-overlap (insurance-vs-turnover)
   **never merge**, even with identical text; a genuine cross-chunk dup still *does* (noisy-OR). A wrong merge = silent miss.
2. **Safety escalation** — a merged group stays gating + mandatory if *any* member is; confidence never drops below a member.
3. **Autofill never bluffs** — no evidence → `needs_input` (empty text, no refs), never fabrication; and the groundedness
   detector **catches a planted fake citation**.
4. **The eval can't hide a disqualifier miss** — a missed gating gold → `dangerous_miss`; *found-but-not-flagged* gating →
   gating recall drops (we measure the failure).

**One honest known limitation (documented, NOT fixed — flagging for transparency):** reconcile is *lexical*, so two
near-identical-but-different requirements that share the **same page AND clause** could merge. Mitigation = the page+clause
AND-gate (the extractor clause-separates distinct requirements); a semantic guard is future work. Not a regression.

This is a clean judge-proof artifact ("here's our adversarial safety suite"). The *other* half of Day-5 (final QA of the
hosted path, demo video) still waits on **G-009** (J's render.yaml flip) — can't judge-test the deployed demo until it runs the real engine.

### [G-014] @all @j · INFO · OPEN · 2026-06-29
**Day-4 "break it before the judges do" — done (in the Generalist lane), and it caught a real problem.**

**1. Locked headline (honest).** The *stable, load-bearing* numbers, every run: **gating recall 1.0 (both disqualifiers
caught & flagged) · 0 dangerous misses · 0 bluffs (42/42 citations verified).** Overall extraction recall wiggles
**~0.79–0.95** run-to-run on SPSO (gpt-4o noise — 15–18/19); **don't quote a single recall %, quote the disqualifier
catch + groundedness** (those don't move). That's the trustworthy story.

**2. Robustness: survives the messy 35%.** Pushed **7/7** of the ugliest distinct real tenders through the WHOLE
pipeline (ingest→extract→reconcile→autofill) — **no crashes**, incl. **66pp NHS framework (472 reqs)**, **53pp
security+cleaning (364 reqs)**, gov.uk example (362), appendix-A (202). Demonstrable "it doesn't fall over."

**3. ⚠️ Quarantined a bad gold set — `museum` needs a human.** The aggregate eval flagged it: museum scored recall
**0.01 / 87 "dangerous misses"** — but that's a **gold artifact, not an extraction failure** (a same-size cleaning
tender extracts 200–360 reqs fine). The museum gold is **auto-generated, never human-validated**: **88/92 rows marked
`is_gating=true`** (manufactures the fake dangerous misses), `type` = `Specification/Commercial/…` (not the
`mandatory/optional` enum), `source_page` = strings (`"Appendix 1 p.1"`). I marked it **`draft: true`** in
`eval-manifest.json` (excluded from scoring — the manifest's own mechanism), so the aggregate reflects only **validated**
gold (SPSO). **@j / whoever labelled museum:** it needs a cleanup pass per `labelling-guide.md` (fix the all-gating
over-marking, the type enum, integer pages); flip `draft:false` and the aggregate lights up "across 2 tenders."

**Demo-set rec (technical — narrative call is @j's):** **hero = SPSO** (clean 13pp, the disqualifier-catch + autofill
story). **Messy proof = NHS 66pp framework** or the 53pp security+cleaning (survives, visibly big/ugly). **Don't demo on
museum** until its gold is fixed.

### [G-013] @all · INFO · OPEN · 2026-06-29
**Docs synced to reality.** Refreshed the markdown so it matches what's on `main`:
- **`engine/README.md`** rewritten — now covers `answer.py` (autofill), `eval_answers.py` (groundedness), `scripts/`,
  the live-API wiring, and the run commands. (The old "autofill fields omitted, arrive via a future PR" note is gone —
  they flow through the API now.)
- **`backend/README.md`** — added the **`POST /tenders/{id}/draft`** row to the endpoints table (provider/limit/files).
- **`STATUS.md`** — Generalist row + a "Recently shipped" entry for the autofill-live + demo-hardening batch.
Nothing functional changed here; just keeping the source of truth honest. The G-009 deploy flip is still the one open item.

### [G-012] @all · INFO · OPEN · 2026-06-29
**Demo-hardening batch — autofill is now fast, proven, sharp, and bidder-uploadable. 98 tests green.**
Four follow-ups to G-010/G-011, all on `main`:
1. **`POST /draft` is demo-fast** — the per-requirement OpenAI calls run **concurrently** (was sequential = minutes
   on 128 reqs) + optional **`?limit=N`** (gating-first) to cap work for a snappy live click. Result is byte-identical
   to sequential (proven in tests). @frontend: the "Autofill with AI" button benefits automatically.
2. **Groundedness eval** (`engine/eval_answers.py`) — makes "**it never bluffs**" a *number*: every grounded answer's
   citation must verifiably exist in the capability docs, no auto-answer may be unevidenced. **On SPSO: 32 grounded,
   96 gaps, 42/42 citations verified, 0 bluffs.** @j — that's a defensible judge-proof line alongside gating recall 1.0.
3. **Sharper gap questions** — the gap interview now uses **J's `prompts/gap-interview.md`** (OpenAI): crisp,
   second-person, gating-first, deduped. *Before:* "Please provide evidence or details for: <full clause>". *After:*
   "Do you hold ISO 9001 certification?" Deterministic mock stays the no-key fallback.
4. **Capability-doc upload** (`/answers`) — @frontend, added a panel to drop in the bidder's own `.pdf/.txt` evidence →
   re-grounds live (`POST /draft` `files=`). Completes two-sided traceability. Your lane (3 small files) — restyle freely.

**Still the #1 demo gate (J): flip G-009** (`render.yaml rootDir: .` + Render `OPENAI_API_KEY`) — it makes the engine
reconcile *and* all of this autofill live on the hosted site. Everything works locally against `:8000` today.

### [G-011] @frontend @j · INFO · OPEN · 2026-06-29
**"Autofill with AI" is now clickable end-to-end** — wired the `POST /tenders/{id}/draft` endpoint (G-010)
into the UI so the precise OpenAI grounding actually fires in the demo. **Build + lint green** (Next 16 production build).
@frontend — this touches your lane (4 small, additive files); revert/restyle freely, flagging so you're not surprised:
- **`lib/api.ts`** — `draftAnswers(tenderId, {provider, files})` → `POST /draft` (mirrors your existing fetch helpers).
- **`context/RequirementsContext.tsx`** — tracks `tenderId` (set in `loadTender`) + a `draftAnswers(provider)` action
  + a `drafting` flag; swaps the enriched requirements + capability docs back into state.
- **`components/AutofillButton.tsx`** (new) — self-contained CTA (uses your `bg-forest`/`text-paper` tokens), so your
  `GapInterview` is untouched. **Hidden on the mock default** (only shows once a live tender is loaded).
- **`app/answers/page.tsx`** — renders the button above the gap interview.

**Demo flow now:** upload → grounded **mock** answers appear instantly (G-010) → click **"Autofill with AI"** →
`?provider=openai` re-drafts precise, evidence-cited prose and it swaps in live. **Two notes:** (1) the OpenAI re-draft
is sequential per requirement, so on a big tender (128 reqs) it runs for a while — great for a *small* demo tender; if
you want it snappy live, trim the tender or I can add a server-side cap (my lane). (2) capability-doc **upload** hits the
same endpoint via multipart `files=` — I left the upload control to you; ping me for the `api.ts` glue. Needs the **G-009
render.yaml fix** to work on the *hosted* site (locally it works against `:8000` now).

### [G-010] @frontend @backend @j · INFO · OPEN · 2026-06-29
**Auditable autofill is now wired into the live API — `GET /tenders/{id}/requirements` returns grounded answers.**
The differentiator is no longer mock-only; the API serves real `answer` + `open_questions` in the locked schema.
**85 tests green** (incl. a FastAPI `TestClient` upload→GET→draft round-trip). All changes import-safe + guarded.

What changed (backend lane — surgical, flagged below):
- **`pipeline.py`** — after reconcile/graph, `run_pipeline` now drafts a grounded answer per requirement from the
  bidder's capability docs (engine.answer). Uses the **MockAnswerer on upload** = deterministic, **free, instant**
  (no surprise 128× LLM calls); so the matrix *and* answers land in one upload with no extra latency.
- **`POST /tenders/{id}/draft`** (new) — re-draft with a real answerer + optional capability-doc upload:
  `?provider=openai` for J's precise answer-generation prompt, or multipart `files=` (.txt/.pdf) to swap in the real
  bidder's docs. Persists + returns the enriched tender.
- **`store.py`** — persists `capability_docs` (idempotent additive migration; answers already ride in the requirement blob).

**@frontend** — your `/answers` answer/evidence/gap UI now renders **real API data**, not just mocks: set
`NEXT_PUBLIC_API_BASE_URL` and upload a tender — answers + `open_questions` + `capability_docs` come back populated.
Optional polish: wire an **"Autofill (AI)"** button → `POST /tenders/{id}/draft?provider=openai` (+ a capability-doc
upload control hitting the same endpoint with `files=`). Want me to add the `api.ts` helper (`draftAnswers(tenderId)`),
or will you take it? It's your lane so I didn't touch `frontend/`.

**@backend** — heads-up, I edited `pipeline.py` / `store.py` / `main.py` (surgical, import-safe, 85 tests green). Autofill
is guarded exactly like reconcile: a backend-rooted deploy just **skips** it (answers stay null, `/draft` → 503) and it
goes **fully live with the G-009 render.yaml fix**. Capability-doc PDF ingest reuses your `ingest_pdf`. Follow-up if you
want it back in your lane: a real capability-doc **library** (persist uploads per bidder, not per tender).

**Real numbers (@j, demo narrative):** ran the wired autofill over the **128 real SPSO requirements** →
**32 grounded answers (each cites a capability doc) · 96 honestly flagged `needs_input`.** The submission *deadline* and
*confidentiality* items correctly came back needs_input — **it asks rather than bluffs.** Note the **upload-path mock
answerer is coarse** (token-overlap, free); for the *precise* grounded prose in the demo, hit `POST /draft?provider=openai`.
Demo line: **"it drafts the answers it can evidence, and asks you about the rest."**

### [G-009] @j @backend · ACTION · OPEN · 2026-06-29
**The deployed API silently runs the PLACEHOLDER reconcile + catches 0 disqualifiers — two tiny fixes make it real.**
This is the Day-4 integration gate; flagging before it bites us in the demo.

**The gap (proven, not guessed):**
- `render.yaml` has `rootDir: backend`, so `engine/` isn't on the path → `backend/app/pipeline.py` falls back to
  `_HAVE_ENGINE = False` → the deployed API uses the **thin placeholder** dedupe + the 0.65 fallback threshold, **not**
  my conservative reconcile / noisy-OR / safety-escalation / calibrated 0.70. Verified: imported from `backend/`
  → `_HAVE_ENGINE = False`; imported from repo root → `True`.
- `OPENAI_API_KEY` is blank on Render → **heuristic extractor → gating recall 0.0** (misses both SPSO disqualifiers,
  per G-006). The 100%-disqualifier-catch headline only holds on the OpenAI path.

**I verified the fix end-to-end through the REAL HTTP endpoints** (uvicorn from repo root + OPENAI key, uploaded
`spso-cleaning.pdf`, GET /requirements, scored vs `gold-set/spso-cleaning.labels.csv`):
**gating recall 1.0 · both disqualifiers caught + flagged · 0 dangerous misses.** Engine is on the path; storage
paths are unaffected (`UPLOAD_DIR` + the SQLite file are `Path(__file__)`-relative → resolve to `backend/…` regardless
of cwd, so `rootDir: .` is safe). Engine is stdlib-only → no new deps.

**@j — the drop-in (3 lines changed in `render.yaml`, everything else as-is):**
```yaml
    rootDir: .
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```
…then **set `OPENAI_API_KEY` in the Render dashboard** (it's `sync: false`, so it lives in the dashboard, not the file).
After redeploy, `GET /health` should read `{"extractor":"openai"}` (today it's `heuristic`). It's your deploy lane so
I didn't touch `render.yaml` — ping me if you'd rather I take the edit.

**Two honesty notes for the narrative (@j):** (1) on this run `needs_review` came back **0%** — every gpt-4o confidence
landed ≥ 0.70 — so the "we flag the uncertain ones" moment isn't guaranteed to fire on SPSO. Lean the live demo on the
**disqualifier catch + source traceability**, not the confidence dot (consistent with G-007). (2) Full-doc extraction
scored recall 0.74 (14/19) vs 0.95 on pp.1-6 — gpt-4o run/scope variance, **@backend**'s lane, not the engine; the
disqualifiers came through either way.

### [G-008] @all · INFO · OPEN · 2026-06-29
**Auditable autofill shipped** — `engine/answer.py` + `engine/scripts/draft_answers.py` (Generalist steps 12-13,
autofill-scope-decision.md). Per requirement: thin RAG over the bidder's capability docs → a **grounded** answer
(cites which doc) or **needs_input**; gaps collapse into a deduped question list. **Emits the exact frontend
`Answer`/`EvidenceRef`/`OpenQuestion` shape** — @frontend your AnswerPanel/GapInterview/OpenQuestions can render real
data, not just mocks. Pluggable: MockAnswerer (free, deterministic, tested) + OpenAIAnswerer (J's
`prompts/answer-generation.md`). **79 tests green.**
- **The trust discipline is real:** on SPSO the OpenAI answerer grounded only **3/19** — exactly the ones it could
  evidence from the docs — and flagged the rest needs_input. **It does not bluff.** That honesty is the product.
- Demo data: `engine/fixtures/capability/` = a mock bidder (AcmeClean Ltd). Tailor per-tender for a punchier demo.
- **Deliberately thin — follow-ups (happy to pair):** (1) wire J's `prompts/gap-interview.md` LLM for SHARPER questions
  (current dedup is deterministic/verbose); (2) **@backend** capability-doc ingest (step 11) + wire answer-draft into
  the live API so the hosted frontend shows real drafts.
Try it: `python -m engine.scripts.draft_answers --gold gold-set/spso-cleaning.labels.csv` (mock, free).

### [G-007] @all · INFO · OPEN · 2026-06-29
**`needs_review` calibrated** (`engine/scripts/calibrate.py`, against the SPSO gold). Set `NEEDS_REVIEW_THRESHOLD`
**0.75 → 0.70** (the highest threshold that flags ≤10% of confirmed-correct items). It flows to the live pipeline
via the import. **Finding worth knowing for the demo narrative (@j):** the LLM's self-reported confidence is only
**weakly informative** — confirmed-correct items average **0.879** vs unmatched **0.866** (Δ0.014). So a confidence
dot / `needs_review` is a *coarse* safety net, not a precise one. The honest demo line stays "we flag the uncertain
ones," but the **load-bearing trust signals are the disqualifier catch + full source traceability**, not the
confidence number — don't over-sell the dot. A better routing signal (flag ungroundable / low-evidence items) is
future work. Calibrated on ONE tender → re-run as more gold lands. 72 tests green.

### [G-006] @all · INFO · OPEN · 2026-06-29
Two things shipped (`engine/`, on main, 70 tests green):
1. **Aggregate eval harness** — `engine/scripts/eval_all.py` + `gold-set/eval-manifest.json`. Runs reconcile→eval
   across EVERY labelled tender and prints a per-tender table + the aggregate headline ("across N tenders: recall X%,
   gating recall Y%, Z dangerous misses"). It lights up automatically as you finish gold. **@all: please finish your
   handoff tenders** (museum is still a stub; add a manifest entry when done) — that's what turns "X% on one tender"
   into "X% across N", the stronger demo claim.
2. **Robustness proof** — ran the **66-page** NHS framework ITT through extract→reconcile end-to-end: 472 reqs, spans
   to p66, 34s, **no crash**. "Survives messy real tenders" (the 35%) — demonstrable.

**IMPORTANT for the demo (@backend @j):** on the **heuristic** extractor SPSO scores **gating recall 0.0** — it misses
BOTH disqualifiers (g17, g19). The 100%-disqualifier-catch headline **only holds with the OpenAI extractor**. So the
live demo + the Render deploy MUST run with `OPENAI_API_KEY` set, or we lose the story. Heuristic = plumbing fallback,
never the demo path.

### [G-005] @j @backend · INFO · OPEN · 2026-06-29
**Wired `engine.reconcile` into the live pipeline** (`backend/app/pipeline.py` — the `_reconcile` +
`_route_confidence` you delegated to me, J-015). The pipeline now uses my **conservative dedupe** (merge only on
text+token+page+clause), **noisy-OR** confidence + **safety escalation**, and my `needs_review` routing. On the
**OpenAI path** that's a healthy **9% needs_review** (12/121 on SPSO — "confident in 91%, flagging 12 to check").
**Import-safe:** a `try/except ImportError` falls back to the old placeholder if `engine/` isn't on the path, so
nothing breaks. 67 tests green; full pipeline smoke-ran end-to-end on the real SPSO PDF.
- **@j (deploy):** locally + repo-root this runs the real engine, but **Render roots at `backend/` (`render.yaml`),
  so the deployed API still uses the fallback.** To make engine live on Render, the deploy needs `engine/` on the
  path — e.g. `rootDir: .`, `buildCommand: pip install -r backend/requirements.txt`,
  `startCommand: uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` (mind the upload/SQLite relative paths).
  Your deploy lane — want me to draft the `render.yaml` change for you to test, or will you take it?
- **@backend:** heads-up, I edited `pipeline.py` (surgical, fallback-safe, tested). Caveat: the **heuristic** path now
  shows 100% `needs_review` (its confidences cap at 0.8) — that's the degraded no-key fallback; OpenAI is the 9%
  above. Real `needs_review` calibration is my Day-3.

### [G-004] @j @backend · ANSWER · RESOLVED · 2026-06-29
Re **J-019** — gating fix **VERIFIED** on SPSO (OpenAI extractor, pp.1-6). Re-ran after your prompt tightening:
- gating **accuracy 0.39 → 1.0** — the over-flagging is gone; no ordinary mandatory item is marked gating now.
- gating **recall stays 1.0** — both disqualifiers still caught + flagged (g17 deadline + g19 pass/fail). **0 dangerous misses.**
Ship it. (Overall recall wiggled 0.95→0.89 = 18→17/19; that's gpt-4o run-to-run noise, not your change — the new miss g3 is
unrelated to gating, and precision ~0.47 is unchanged.) Resolved my end — flip J-019 when you see this.

### [G-003] @all · INFO · OPEN · 2026-06-29
**First REAL eval number.** Ran the full loop on SPSO end-to-end (PDF → backend extract → reconcile → eval vs
`gold-set/spso-cleaning.labels.csv`, pp.1-6) via `engine/scripts/run_tender.py`:
**recall 0.95 (18/19) · gating recall 1.0 (both disqualifiers g17+g19 caught & flagged) · 0 dangerous misses.**
That's our demo headline on a real tender. Notes for the team:
- **Precision 0.47 / 20 "false positives"** is mostly **gold granularity** — the extractor (OpenAI path) is recall-first
  and emits every obligation; the gold lists 19 key items. **@j @joel:** when verifying `spso-cleaning.labels.csv`, the
  tool's extras are worth a skim — several look like real requirements to add.
- **@backend:** the **gating classifier over-flags** (gating *accuracy* among matches only 0.39 — non-gating items
  marked gating). Worth tightening `extract._is_gating`. Gating *recall* is perfect, so we're safe, just noisy.
- FYI reconcile merged **0 of 115** candidates here (conservative gate didn't fire on this tender) — fine for now;
  I'll revisit if real cross-chunk dupes appear. The only real miss is g16 (a phrasing near-miss, not a gap).
- The run also surfaced + fixed a real bug: LLM/heuristic extractors emit `char_start=None`; reconcile now tolerates it.

### [G-002] @frontend · INFO · OPEN · 2026-06-29
Heads-up on the reconcile output contract (now on `main` under `engine/`). It emits **exactly the live
`frontend/src/types/requirement.ts` shape** — the 15-field `Requirement` + `{tender_id, title, requirements}`
envelope — so it's a true drop-in, no reshaping. It **deliberately omits** `answer`/`open_questions`/`capability_docs`
because your type doesn't declare them yet; they land via your mirror PR + the Day-3 answer-draft step. **One real
flag:** the raw-extraction format permits a **null `source_clause`**, but your `Requirement` declares it `string`
(non-nullable). The mock never emits null, so nothing breaks today — but when you mirror the autofill fields, please
also make `source_clause` nullable (or ping me to coordinate). Don't change it from my lane.

### [G-001] @backend @j · ANSWER · RESOLVED · 2026-06-29
Re **J-002**: raw-extraction format **signed off** — building the reconcile module against it surfaced no problems.
The `engine/` reconcile + dedupe is on `main`: 6 raw → 5 final on the mock, the seeded cross-chunk ISO-9001 duplicate
merges (noisy-OR confidence 0.9928), conservative AND-gate (char + token-Jaccard + page + clause), 60 tests green.
**One FYI for backend (no action):** I do **not** use `char_start`/`char_end` as a cross-item proximity signal — they're
chunk-local, so comparing them across chunks is incoherent; I merge on page + clause + text/token similarity, and keep
the offsets only for document-order tie-breaking. Emit them as-is; the format is good to lock. The eval harness +
gold-set format are also in (`engine/eval.py`, `engine/gold/`) — the Day-2 headline-number machine.
