# Oh-TEN-tic! Paskorisyuhan 2026

Official digital headquarters of **CCES Interbatch Paskorisyuhan 2026**:
*"Oh-TEN-tic Fun, Christmas for Everyone!"*
Hosted by CCES Alumni Association – Batch 2010 "Oh-TEN-tic!", Can-avid, Eastern Samar.

Featured event: **Oh-TEN-tic! Fun Run for Everyone, December 5, 2026** (5KM · 8KM · 12KM).

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Realtime, Storage) · Vercel

## Status

| Phase | Scope | Status |
|---|---|---|
| 1 | Foundation, brand, public site, Fun Run page, auth, admin settings | ✅ Built |
| 2 | Google Sheets registration sync, registration dashboard, bibs | Next |
| 3 | Checkpoint reporting + live monitoring | Planned |
| 4 | Race clock, finish line, leaderboards, results approval | Planned |
| 5 | Sports, parade, bingo, raffle, master program, upcoming | Planned |
| 6 | Facebook Page integration | Planned |
| 7 | Gallery, podium & awarding | Planned |
| 8 | Full testing, security review, deployment | Planned |

## Documentation

- [docs/SETUP.md](docs/SETUP.md): step-by-step setup (Supabase, first admin, Vercel)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): design, roles, data model for all phases
- [docs/TESTING.md](docs/TESTING.md): test checklist

## Commands

```bash
npm run dev          # local development
npm run typecheck    # TypeScript
npm test             # unit tests
npm run db:check     # apply all SQL migrations in an embedded Postgres + test security rules
npm run build        # production build
```
