# Contributing — the fast hackathon flow

7-day build, 4 people, max speed. Keep `main` always demo-able. That's the whole goal.

## One-time setup

```bash
git clone https://github.com/Welddevelopment/Tender_Breakdown_AI-Agent.git
cd Tender_Breakdown_AI-Agent
```

## Every feature

```bash
git checkout main
git pull                              # always start from latest
git checkout -b <prefix>/<short-name> # e.g. frontend/source-panel

# ...work, commit in small chunks...
git add -A
git commit -m "add source panel"

git push -u origin <prefix>/<short-name>
```

Then open a **Pull Request → `main`** on GitHub. A teammate gives it a 30-second
look and merges. Everyone `git pull`s `main`. Repeat.

## Branch prefixes (so we don't collide)

| Person | Prefix | Lives in |
|--------|--------|----------|
| Backend | `backend/` | `/backend` |
| Generalist | `general/` | `/backend`, eval |
| Frontend | `frontend/` | `/frontend` |
| J | `glue/` | prompts, orchestration |

## Hackathon rules of thumb

- **Small PRs merge fast.** A 200-line PR gets reviewed; a 2000-line one rots.
- **Commit often**, push at least daily — no heroic local-only branches.
- **Trivial fixes** (typo, lint) → just push to `main`. Features → always a branch.
- **Pull `main` every morning** before you start, or you'll fight merge conflicts.
- **Never commit** `.env`, secrets, `node_modules/`, `.venv/`, or tender PDFs (`.gitignore` covers these — don't `git add -f` past it).

## The locked thing

The **requirement schema** ([AGENTS.md](AGENTS.md)) is frozen. Everyone builds against it.
Changing it breaks both frontend and backend at once — so it only changes by team agreement, never in a solo PR.
