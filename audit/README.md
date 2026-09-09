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
| `audit:contracts` | Is there a handler for this path, and does it persist anything? |
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

Production is Firebase static hosting: `build.js` copies `.next/server/app`
into `out/`, and `firebase.json` serves `out/` with a `**` → `/index.html`
rewrite. Nothing in `src/app/api/` executes — those 122 files compile to
`out/api/*/route.js` and are served as inert static text. The browser is the
backend, and a request passes through four layers:

| # | layer | file | what it does |
|---|---|---|---|
| 1 | interceptor | `src/lib/fetchInterceptor.ts` | hijacks `fetch('/api/*')`. Exempt paths reach the network and get `index.html` back. |
| 2 | preferLive | `src/lib/api/client.ts` `request()` | for 27 prefixes, tries the network first. Under static hosting that returns `index.html` with HTTP 200, `res.json()` throws, and it falls through — one wasted request per prefix, never a success. |
| 3 | campus switch | `src/lib/campusFallback.ts` | ~102 cases delegating to `src/lib/services/*`. Default case throws. |
| 4 | firestoreRouter | `src/lib/api/client.ts` | ordered if-chain of ~172 guards. **First match wins**; later guards for the same path are unreachable. |

`src/app/api/**` is dead code in production — but it is not garbage. It is the
written specification for what each handler should do, and every fix should be
ported from it.

## Outputs

| file | contents |
|---|---|
| `CONTRACTS.md` / `contracts.json` | every `/api` path the client calls, which layer answers it, and whether that answer touches a datastore |
| `LEDGER.md` | the same data rolled up per feature vertical — the work queue |
| `HEADERS.md` | hosts blocked by CSP, devices denied by Permissions-Policy, secrets shipped to the browser |
| `RUNTIME.md` / `runtime.json` | console errors and shim distress signals per route, from a real page load |

## Reading the verdicts

- `REAL` — reaches a datastore. Working.
- `STUB` — returns a hardcoded literal. **The feature silently does nothing.**
- `THROWS` — raises `ApiError`. Visibly broken.
- `UNHANDLED-404` — no guard matches; the end of the chain throws.
- `CAMPUS-404` — campus path with no `case`; the switch default throws.
- `BYPASSES-SHIM` — the interceptor exempts it, so the Firebase rewrite answers
  with `index.html` and `res.json()` fails.
- `EXTERNAL` / `COMPUTE` — calls out over the network, or computes locally. Fine.

Severity separates `BROKEN` (every HTTP method that reaches a handler fails)
from `PARTIAL` (some methods work). Guards are commonly written as
`path === X && method === 'POST'`, so the other four methods legitimately fall
through to the 404 at the end of the chain; counting those as defects would
report almost every POST-only endpoint as missing.

## Buckets

- **A** — port to the client. Plain datastore CRUD; adapt the dead route's logic
  and enforce access in Firestore/Supabase rules, since there is no server.
- **B** — needs a trusted server. Reads a secret, verifies a signature, or
  presigns a URL. Cannot be done in a browser at any quality level; belongs in
  the existing `backend/` FastAPI service, reached via `NEXT_PUBLIC_BACKEND_URL`.
- **C** — genuinely stateless. No action.

## Known limits

Stated plainly so nobody over-trusts the output:

- **Call-site methods are not extracted.** A path's severity is judged across
  every HTTP method that reaches a handler, not the method the call site uses.
  Check the call site before treating a `PARTIAL` as a defect.
- **`REAL` means "reaches a datastore", not "correct".** It does not check that
  the shape it returns matches what the page expects. That check is the reading
  work in each vertical's session.
- **Some services write to `src/lib/services/localJsonDb.ts`**, not to Firestore.
  Those count as `REAL` here but do not persist across devices.
- **Dynamically built paths are matched by their literal fragments.** A path
  assembled entirely at runtime will not appear.
- **The runtime walk is unauthenticated by default.** Authenticated pages
  redirect to `/login`, so their handlers never run and their errors never
  appear. `--authenticated` exercises handlers that write to Firestore — only
  point it at a throwaway project.

## The progress metric

`distinctErrors` in `RUNTIME.md` must fall between runs. Record it in the commit
message. It is measured, not asserted.
