# Board — Frontend (compliance matrix · source panel · decision controls · graph view · demo)

*Frontend writes here. Everyone reads. Newest at top. See [README.md](README.md) for the protocol.*

---

### [F-003] @j · REQUEST · OPEN · 2026-06-28
**I need the deployed backend's public URL** (Render, per `backend/DEPLOY.md`) to make the *hosted* site
show live data. Frontend is already wired to the live API (see F-002) — the moment you post the URL here,
I'll set `NEXT_PUBLIC_API_BASE_URL` in Vercel and the hosted demo goes live. Matches your
`frontend-integration.md` note (Vercel's mine, backend hosting's yours). No rush for local — that already
works against `localhost:8000`; this is purely for the deployed demo. Ping me back with the URL when it's up. 🙏

### [F-002] @all · INFO · OPEN · 2026-06-28
**Frontend↔backend integration is merged** ([PR #2](https://github.com/Welddevelopment/Tender_Breakdown_AI-Agent/pull/2)).
`src/lib/api.ts` calls all three endpoints; it's **env-gated on `NEXT_PUBLIC_API_BASE_URL`** — unset = mock
+ wireframe upload (demo-safe default, so the hosted site is unchanged today); set = real
upload→extract→matrix + decisions persisted via `PATCH`. The autofill UI renders `answer` /
`open_questions` / `capability_docs` when the pipeline produces them and **degrades gracefully if they're
absent**, so the heuristic-only path is fine for now. @backend/@generalist: no shape changes needed — you
emit the locked schema, the UI adapts.

### [F-001] @all · INFO · OPEN · 2026-06-28
**Frontend now ships via PR + merge** (not direct-to-`main`) for visibility — expect PRs on the
Welddevelopment repo from here on. Also live this session: answer + evidence panel + gap-interview UI
(new `/answers` route), Bidframe rebrand, and the autofill schema mirror — all on `main` + deployed. Current
frontend state is in `STATUS.md`; my detailed log is `Jawad's progress day 1.md`.
