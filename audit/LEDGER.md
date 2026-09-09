# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages, the handler branches that
serve them, and the dead route under `src/app/api/` that specifies what the
handler should do.

**Bucket** — `A` port to the client (plain datastore CRUD) · `B` needs a trusted
server, move to `backend/` (secrets, signature verification, presigning) ·
`C` genuinely stateless.

## Remaining (25 verticals, 50 broken + 12 partial paths)

| vertical | broken | partial | ok | buckets |
|---|---|---|---|---|
| `resume` | 2 | 4 | 2 | A:6 |
| `exam` | 5 | 0 | 0 | A:5 |
| `interview` | 2 | 2 | 1 | B:4 |
| `settings` | 4 | 0 | 0 | A:4 |
| `avatar` | 2 | 1 | 0 | A:3 |
| `chat` | 2 | 1 | 0 | A:3 |
| `opportunities` | 2 | 1 | 2 | A:3 |
| `personality` | 3 | 0 | 0 | A:3 |
| `portfolio` | 3 | 0 | 0 | A:2 B:1 |
| `university` | 3 | 0 | 0 | A:3 |
| `v1-auth` | 3 | 0 | 1 | A:3 |
| `vault` | 0 | 3 | 0 | A:3 |
| `attention-span` | 2 | 0 | 0 | A:2 |
| `cache` | 2 | 0 | 0 | A:2 |
| `career-twin` | 2 | 0 | 0 | A:2 |
| `code` | 2 | 0 | 0 | A:1 B:1 |
| `notes` | 2 | 0 | 0 | A:2 |
| `payment` | 2 | 0 | 1 | B:2 |
| `attendance` | 1 | 0 | 0 | B:1 |
| `gd` | 1 | 0 | 0 | B:1 |
| `github` | 1 | 0 | 0 | B:1 |
| `notifications` | 1 | 0 | 2 | A:1 |
| `projects` | 1 | 0 | 0 | B:1 |
| `stt` | 1 | 0 | 0 | B:1 |
| `tts` | 1 | 0 | 0 | A:1 |

## Clean (32 verticals)

`admin` (5) · `admissions` (1) · `advisor` (4) · `alumni` (4) · `analytics` (1) · `auth` (7) · `career-builder` (1) · `career-dna` (2) · `communication` (2) · `consultant` (8) · `documents` (2) · `events` (2) · `exams` (2) · `finance` (4) · `grievances` (2) · `group-discussion` (2) · `hostel` (6) · `library` (4) · `llm` (1) · `maintenance` (2) · `messages` (1) · `missions` (6) · `parent` (3) · `pins` (3) · `quests` (1) · `recruiter` (13) · `research` (2) · `services` (5) · `study` (1) · `teacher` (2) · `transport` (2) · `trust` (2)

## Detail

### resume — 2 broken, 4 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/resume/:param/improve` | PARTIAL | STUB | A | client.ts:1179 |
| `/api/resume/generate-from-vault` | PARTIAL | STUB | A | client.ts:1179 |
| `/api/resume/list` | BROKEN | STUB | A | client.ts:1179 |
| `/api/resume/structured` | PARTIAL | STUB | A | client.ts:1179 |
| `/api/resume/suggestions` | BROKEN | STUB | A | client.ts:1179 |
| `/api/resume/upload` | PARTIAL | STUB | A | client.ts:1179 |

### exam — 5 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/exam/:param/questions` | BROKEN | STUB | A | client.ts:1465 |
| `/api/exam/available` | BROKEN | STUB | A | client.ts:1464 |
| `/api/exam/results` | BROKEN | STUB | A | client.ts:1467 |
| `/api/exam/scheduled` | BROKEN | STUB | A | client.ts:1468 |
| `/api/exam/sync-result` | BROKEN | STUB | A | client.ts:1466 |

### interview — 2 broken, 2 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/interview/assist` | BROKEN | STUB | B | client.ts:1455 |
| `/api/interview/chat` | PARTIAL | STUB | B | client.ts:1455 |
| `/api/interview/evaluate` | PARTIAL | STUB | B | client.ts:1455 |
| `/api/interview/generate-problem` | BROKEN | STUB | B | client.ts:1455 |

### settings — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/settings/erp/sync` | BROKEN | STUB | A | campusFallback.ts:306 |
| `/api/settings/migration/execute` | BROKEN | STUB | A | campusFallback.ts:306 |
| `/api/settings/migration/validate` | BROKEN | STUB | A | campusFallback.ts:306 |
| `/api/settings/rollout/feedback` | BROKEN | STUB | A | campusFallback.ts:306 |

### avatar — 2 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/avatar/chat` | PARTIAL | STUB | A | client.ts:3180 |
| `/api/avatar/context` | BROKEN | STUB | A | client.ts:2723 |
| `/api/avatar/memory` | BROKEN | STUB | A | client.ts:3180 |

### chat — 2 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/chat` | PARTIAL | STUB | A | client.ts:1631 |
| `/api/chat/history/:param` | BROKEN | STUB | A | client.ts:1630 |
| `/api/chat/session` | BROKEN | STUB | A | client.ts:1629 |

### opportunities — 2 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/opportunities` | PARTIAL | STUB | A | client.ts:1189 |
| `/api/opportunities/applications` | BROKEN | STUB | A | client.ts:1196 |
| `/api/opportunities/match` | BROKEN | STUB | A | client.ts:1195 |

### personality — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/personality/analyze` | BROKEN | STUB | A | client.ts:1462 |
| `/api/personality/report` | BROKEN | STUB | A | client.ts:1460 |
| `/api/personality/session` | BROKEN | STUB | A | client.ts:1461 |

### portfolio — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/portfolio/analyze-certificate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/portfolio/verify-endorsement` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/portfolio/verify-exam` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### university — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/university/dashboard` | BROKEN | STUB | A | client.ts:1973 |
| `/api/university/employability-report` | BROKEN | STUB | A | client.ts:2022 |
| `/api/university/skill-gaps` | BROKEN | STUB | A | client.ts:2038 |

### v1-auth — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/v1/auth/exchange-session` | BROKEN | STUB | A | client.ts:313 |
| `/api/v1/auth/logout-all` | BROKEN | STUB | A | client.ts:407 |
| `/api/v1/auth/vault-approve` | BROKEN | STUB | A | client.ts:273 |

### vault — 0 broken, 3 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/vault` | PARTIAL | STUB | A | client.ts:1182 |
| `/api/vault/delete` | PARTIAL | STUB | A | client.ts:1185 |
| `/api/vault/upload` | PARTIAL | STUB | A | client.ts:1184 |

### attention-span — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/attention-span/analytics` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/attention-span/leaderboard` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### cache — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/cache/hash` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/cache/stats` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### career-twin — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/career-twin/results` | BROKEN | STUB | A | client.ts:714 |
| `/api/career-twin/run` | BROKEN | STUB | A | client.ts:715 |

### code — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/code/run-java` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/code/run-python` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### notes — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/notes` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |
| `/api/notes/upload` | BROKEN | CAMPUS-404 | A | campusFallback.ts default: throws |

### payment — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/payment/create-order` | BROKEN | THROWS | B | client.ts:1264 |
| `/api/payment/verify` | BROKEN | THROWS | B | client.ts:1268 |

### attendance — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/attendance/identify` | BROKEN | THROWS | B | client.ts:3223 |

### gd — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/gd/history` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### github — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/github/ingest` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### notifications — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/notifications/:param/read` | BROKEN | STUB | A | client.ts:1188 |

### projects — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/projects/generate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### stt — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/stt` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### tts — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/tts` | BROKEN | BYPASSES-SHIM | A | src/lib/fetchInterceptor.ts |
