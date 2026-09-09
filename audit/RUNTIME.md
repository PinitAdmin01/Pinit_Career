# Runtime walk — generated, do not hand-edit

Regenerate: `npm run build && node audit/walk-routes.mjs`

Served from `out/` with firebase.json semantics (cleanUrls + `**` -> /index.html),
not `next dev`, so the API routes are inert exactly as they are in production.
Not signed in, so authenticated pages redirect to /login and their handlers do not run.

- **generated**: 2026-09-09T15:48:08.169Z
- **authenticated**: false
- **routesWalked**: 6
- **routesWithErrors**: 0
- **routesRedirected**: 6
- **distinctErrors**: 0
- **totalErrors**: 0
- **signalCounts**: {}

**distinctErrors is the progress metric.** It must fall between runs; record it in the commit.

## Distinct errors (0)

_none_

## Per route

| route | final | errors | signals |
|---|---|---|---|
| `/attention-span` | `/` | 0 | — |
| `/career-intelligence` | `/` | 0 | — |
| `/dashboard` | `/` | 0 | — |
| `/notifications` | `/` | 0 | — |
| `/profile` | `/` | 0 | — |
| `/vault` | `/` | 0 | — |
