# audit/ — the instrument

Read-only tooling that answers "which features actually work?" without anyone
having to read 105,000 lines of application code.

```bash
npm run audit               # contracts + headers, both static, a few seconds
npm run build               # required before the runtime walk
npm run audit:runtime       # runtime: load every built route, collect real console errors
```

There are three defect classes, and they need three different checks:

| check | question it answers |
|---|---|
| `audit:contracts` | Does a server route under `src/app/api/` serve every path (and method) the client calls? |
| `audit:headers` | Will the browser even permit the call, given the headers `firebase.json` sends? |
| `audit:runtime` | What does the app actually do when a real browser loads the page? |

The second one matters more than it looks. A `connect-src` that omits a host, or
a `Permissions-Policy` that denies the camera, produces exactly the symptom of a
stubbed handler — the feature silently does nothing — but no amount of reading
`src/` will show it, because the cause is in `firebase.json`.

Everything in this directory is generated or read-only. The scripts never write
to `src/`.

## Why this exists

`npx tsc --noEmit` reports 0 errors and `npx eslint` reports 0 errors. The
defects in this codebase are not type or syntax defects — they are **contract**
defects, which live *between* a page and the handler that answers it. No linter
can see one, and reading a file in isolation cannot either, because you have to
compare two things that sit in different files.

## What actually serves a request in production

The app runs on a server host (`npm run build`), so the route handlers under
`src/app/api/` execute, and every `/api/*` call the browser makes goes to them:

| # | layer | file | what it does |
|---|---|---|---|
| 1 | interceptor | `src/lib/fetchInterceptor.ts` | attaches the Supabase session as `Authorization` to same-origin `fetch('/api/*')` calls. Nothing else. |
| 2 | request() | `src/lib/api/client.ts` | `api.get/post/…` send every `/api/*` path to the server and throw `ApiError` on any non-2xx. There is no in-browser fallback. |
| 3 | campus switch | *(removed 2026-09-28)* | was `src/lib/campusFallback.ts`. Unreachable once every `/api/*` call went to the server. |
| 4 | firestoreRouter | *(removed 2026-09-28)* | was `src/lib/api/legacyFirestoreRouter.ts`. Unreachable for the same reason. |

So a call works only if a route file matches its path and exports its method.
A path with no route is `UNHANDLED-404` and the page gets a 404 `ApiError`.
(`LIVE_API_PREFIXES` in `client.ts` no longer decides anything: `request()`
already treats every `/api/` path as live.)

`npm run build:static` (legacy Firebase hosting) still exists; under it nothing
in `src/app/api/` runs and every one of these calls fails.

## Outputs

| file | contents |
|---|---|
| `CONTRACTS.md` / `contracts.json` | every `/api` path the client calls and the `src/app/api/` route that serves it, if any |
| `LEDGER.md` | the same data rolled up per feature vertical — the work queue |
| *(stdout)* `scripts/verify/verify_api_parity.ts` | second half of `audit:contracts`: each call site's path **and method** against the routes; exits 1 if a reachable call has no route or uses a method the route does not export |
| `HEADERS.md` | hosts blocked by CSP, devices denied by Permissions-Policy, secrets shipped to the browser |
| `RUNTIME.md` / `runtime.json` | console errors and shim distress signals per route, from a real page load |

## Reading the verdicts

- `SERVER` — a route under `src/app/api/` matches the path and exports the method.
- `UNHANDLED-404` — no route matches the path (or none exports the method); the
  server answers 404 and `request()` throws `ApiError`.

`REAL`, `STUB`, `THROWS`, `CAMPUS-404`, `BYPASSES-SHIM`, `EXTERNAL` and
`COMPUTE` were verdicts for the in-browser router; they only appear if those
removed files come back.

## Buckets

- **OK** — a server route answers it.
- **A** — nothing answers it. Add the route under `src/app/api/`, or point the
  caller at the route that already does the job.

## Known limits

Stated plainly so nobody over-trusts the output:

- **`extract-contracts.mjs` does not read call-site methods**; it judges a path
  across every method its route exports. `verify_api_parity.ts` does read them
  (from `api.get/post/…` and `fetch(…, { method })`) and fails on a mismatch.
- **`SERVER` means "a route exists", not "correct".** It does not check that the
  route persists anything or returns the shape the page expects. That check is
  the reading work in each vertical's session.
- **Dynamically built paths are matched by their literal fragments.** A path
  assembled entirely at runtime will not appear.
- **The runtime walk is unauthenticated by default.** Authenticated pages
  redirect to `/login`, so their handlers never run and their errors never
  appear. `--authenticated` exercises handlers that write to Firestore — only
  point it at a throwaway project.

## The progress metric

`distinctErrors` in `RUNTIME.md` must fall between runs. Record it in the commit
message. It is measured, not asserted.
