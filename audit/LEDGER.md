# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages, the handler branches that
serve them, and the dead route under `src/app/api/` that specifies what the
handler should do.

**Bucket** — `A` port to the client (plain datastore CRUD) · `B` needs a trusted
server, move to `backend/` (secrets, signature verification, presigning) ·
`C` genuinely stateless.

## Remaining (14 verticals, 13 broken + 8 partial paths)

| vertical | broken | partial | ok | dead | buckets |
|---|---|---|---|---|---|
| `interview` | 2 | 2 | 1 | 0 | B:4 |
| `vault` | 0 | 3 | 0 | 0 | A:3 |
| `code` | 2 | 0 | 0 | 0 | A:1 B:1 |
| `portfolio` | 2 | 0 | 1 | 0 | B:2 |
| `avatar` | 0 | 1 | 2 | 0 | A:1 |
| `career-twin` | 1 | 0 | 0 | 1 | A:1 |
| `gd` | 1 | 0 | 0 | 0 | B:1 |
| `github` | 1 | 0 | 0 | 0 | B:1 |
| `opportunities` | 0 | 1 | 4 | 0 | A:1 |
| `payment` | 1 | 0 | 1 | 1 | B:1 |
| `projects` | 1 | 0 | 0 | 0 | B:1 |
| `resume` | 0 | 1 | 2 | 5 | A:1 |
| `stt` | 1 | 0 | 0 | 0 | B:1 |
| `tts` | 1 | 0 | 0 | 0 | A:1 |

`dead` = the path is only called from code that is never built, so no visitor can
reach it. Not work. 23 defective paths across the codebase are dead;
they are listed at the end of this file.

## Clean (43 verticals)

`admin` (5) · `admissions` (1) · `advisor` (4) · `alumni` (4) · `analytics` (1) · `attendance` (0) · `attention-span` (2) · `auth` (7) · `cache` (0) · `career-builder` (1) · `career-dna` (2) · `chat` (0) · `communication` (2) · `consultant` (8) · `documents` (2) · `events` (2) · `exam` (0) · `exams` (2) · `finance` (4) · `grievances` (2) · `group-discussion` (2) · `hostel` (6) · `library` (4) · `llm` (1) · `maintenance` (2) · `messages` (1) · `missions` (6) · `notes` (0) · `notifications` (3) · `parent` (3) · `personality` (0) · `pins` (3) · `quests` (1) · `recruiter` (13) · `research` (2) · `services` (5) · `settings` (4) · `study` (1) · `teacher` (2) · `transport` (2) · `trust` (2) · `university` (3) · `v1-auth` (4)

## Detail

### interview — 2 broken, 2 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/interview/assist` | BROKEN | STUB | B | client.ts:1471 |
| `/api/interview/chat` | PARTIAL | STUB | B | client.ts:1471 |
| `/api/interview/evaluate` | PARTIAL | STUB | B | client.ts:1471 |
| `/api/interview/generate-problem` | BROKEN | STUB | B | client.ts:1471 |

### vault — 0 broken, 3 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/vault` | PARTIAL | STUB | A | client.ts:1188 |
| `/api/vault/delete` | PARTIAL | STUB | A | client.ts:1191 |
| `/api/vault/upload` | PARTIAL | STUB | A | client.ts:1190 |

### code — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/code/run-java` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/code/run-python` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### portfolio — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/portfolio/analyze-certificate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/portfolio/verify-exam` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### avatar — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/avatar/chat` | PARTIAL | STUB | A | client.ts:3167 |

### career-twin — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/career-twin/results` | BROKEN | STUB | A | client.ts:720 |

### gd — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/gd/history` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### github — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/github/ingest` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### opportunities — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/opportunities` | PARTIAL | STUB | A | client.ts:1200 |

### payment — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/payment/create-order` | BROKEN | THROWS | B | client.ts:1280 |

### projects — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/projects/generate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### resume — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/resume/upload` | PARTIAL | STUB | A | client.ts:1185 |

### stt — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/stt` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### tts — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/tts` | BROKEN | BYPASSES-SHIM | A | src/lib/fetchInterceptor.ts |


## Defects in dead code — do not fix (23)

Every call site for these lives in a file no built page imports. Fixing them
changes nothing a visitor can see. Delete the callers, or leave them.

- `/api/attendance/identify` (THROWS) — called from src/app/_legacy/attendance/page.tsx
- `/api/cache/hash` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/cache/stats` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/career-twin/run` (STUB) — called from src/lib/api/hooks.ts
- `/api/chat` (STUB) — called from src/components/learn/ChatInterface.tsx
- `/api/chat/history/:param` (STUB) — called from src/components/learn/ChatInterface.tsx
- `/api/chat/session` (STUB) — called from src/app/_legacy/learn/page.tsx
- `/api/exam/:param/questions` (STUB) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/available` (STUB) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/results` (STUB) — called from src/app/_legacy/exam/page.tsx, src/lib/api/hooks.ts
- `/api/exam/scheduled` (STUB) — called from src/lib/api/hooks.ts
- `/api/exam/sync-result` (STUB) — called from src/components/exam/PinITExamEngine.tsx
- `/api/notes` (CAMPUS-404) — called from src/components/learn/NotesList.tsx
- `/api/notes/upload` (CAMPUS-404) — called from src/components/learn/NotesList.tsx
- `/api/payment/verify` (THROWS) — called from src/app/_legacy/pricing/page.tsx
- `/api/personality/analyze` (STUB) — called from src/app/_legacy/personality/page.tsx
- `/api/personality/report` (STUB) — called from src/app/_legacy/personality/page.tsx, src/lib/api/hooks.ts
- `/api/personality/session` (STUB) — called from src/app/_legacy/personality/page.tsx
- `/api/resume/:param/improve` (STUB) — called from src/components/career/ResumeUpload.tsx
- `/api/resume/generate-from-vault` (STUB) — called from src/app/_legacy/resume/page.tsx, src/components/career/ResumeUpload.tsx
- `/api/resume/list` (STUB) — called from src/lib/api/hooks.ts
- `/api/resume/structured` (STUB) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/suggestions` (STUB) — called from src/components/career/ResumeForm.tsx

## Page files that are never built (15)

- `src/app/_legacy/attendance/page.tsx`
- `src/app/_legacy/career-assets/page.tsx`
- `src/app/_legacy/career-builder/page.tsx`
- `src/app/_legacy/exam/page.tsx`
- `src/app/_legacy/interview/page.tsx`
- `src/app/_legacy/leaderboard/page.tsx`
- `src/app/_legacy/learn/page.tsx`
- `src/app/_legacy/personality/page.tsx`
- `src/app/_legacy/pricing/page.tsx`
- `src/app/_legacy/qr-confirm/page.tsx`
- `src/app/_legacy/qr-login/page.tsx`
- `src/app/_legacy/resume/page.tsx`
- `src/app/_legacy/sentinel/page.tsx`
- `src/app/_legacy/teacher/page.tsx`
- `src/app/_legacy/trust/page.tsx`
