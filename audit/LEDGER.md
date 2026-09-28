# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages and the routes under
`src/app/api/` that serve them.

**Bucket** — `A` no server route answers the path (or none exports the method):
add the route under `src/app/api/`, or fix the caller.

## Remaining (15 verticals, 32 broken + 0 partial paths)

| vertical | broken | partial | ok | dead | buckets |
|---|---|---|---|---|---|
| `recruiter` | 7 | 0 | 5 | 1 | A:7 |
| `opportunities` | 5 | 0 | 0 | 0 | A:5 |
| `settings` | 4 | 0 | 0 | 0 | A:4 |
| `auth` | 3 | 0 | 8 | 0 | A:3 |
| `consultant` | 2 | 0 | 5 | 0 | A:2 |
| `exams` | 2 | 0 | 4 | 0 | A:2 |
| `analytics` | 1 | 0 | 0 | 0 | A:1 |
| `cache` | 1 | 0 | 0 | 2 | A:1 |
| `communication` | 1 | 0 | 1 | 0 | A:1 |
| `finance` | 1 | 0 | 4 | 0 | A:1 |
| `missions` | 1 | 0 | 4 | 1 | A:1 |
| `news` | 1 | 0 | 0 | 0 | A:1 |
| `pins` | 1 | 0 | 6 | 0 | A:1 |
| `teacher` | 1 | 0 | 1 | 1 | A:1 |
| `vault` | 1 | 0 | 2 | 0 | A:1 |

`dead` = the path is only called from code that is never built, so no visitor can
reach it. Not work. 33 defective paths across the codebase are dead;
they are listed at the end of this file.

## Clean (55 verticals)

`admin` (8) · `admissions` (1) · `advisor` (4) · `arena` (4) · `attendance` (0) · `attention-span` (3) · `avatar` (3) · `career-builder` (1) · `career-dna` (0) · `career-twin` (2) · `certificates` (2) · `chat` (0) · `code` (4) · `codewars` (1) · `contact` (1) · `documents` (2) · `events` (2) · `exam` (1) · `friends` (7) · `gd` (1) · `github` (1) · `grievances` (2) · `group-discussion` (2) · `hostel` (6) · `internships` (1) · `interview` (6) · `leaderboard` (1) · `library` (4) · `llm` (1) · `maintenance` (2) · `mentor` (1) · `messages` (1) · `notes` (0) · `notifications` (3) · `parent` (3) · `pathway` (1) · `payment` (2) · `personality` (0) · `portfolio` (3) · `projects` (2) · `quest` (1) · `quests` (4) · `research` (2) · `resume` (0) · `services` (5) · `stt` (1) · `student` (1) · `study` (0) · `time` (1) · `transport` (2) · `trust` (0) · `tts` (1) · `university` (4) · `verify` (1) · `xp` (1)

## Detail

### recruiter — 7 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/recruiter/activity-log` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/analytics` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/applications` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/candidate/:param` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/company` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/jobs` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/recruiter/jobs/:param` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### opportunities — 5 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/opportunities` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/opportunities/applications` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/opportunities/apply` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/opportunities/feed` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/opportunities/match` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### settings — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/settings/erp/sync` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/settings/migration/execute` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/settings/migration/validate` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/settings/rollout/feedback` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### auth — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/auth/face/enrolled` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/auth/profile` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/auth/teacher` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### consultant — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/consultant/sessions` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/consultant/student/:param/task` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### exams — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/exams/results` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |
| `/api/exams/schedule` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### analytics — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/analytics/dashboard` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### cache — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/cache/clear` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### communication — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/communication/evaluate` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### finance — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/finance/dues` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### missions — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/missions/generate-custom-skill` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### news — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/news` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### pins — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pins/balance` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### teacher — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/teacher/students` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |

### vault — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/vault` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |


## Defects in dead code — do not fix (33)

Every call site for these lives in a file no built page imports. Fixing them
changes nothing a visitor can see. Delete the callers, or leave them.

- `/api/attendance/identify` (UNHANDLED-404) — called from src/app/_legacy/attendance/page.tsx
- `/api/cache/hash` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/cache/stats` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/career-dna/profile` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/career-dna/scores` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/career-twin/run` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/chat` (UNHANDLED-404) — called from src/components/learn/ChatInterface.tsx
- `/api/chat/history/:param` (UNHANDLED-404) — called from src/components/learn/ChatInterface.tsx
- `/api/chat/session` (UNHANDLED-404) — called from src/app/_legacy/learn/page.tsx
- `/api/exam/:param/questions` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/available` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/results` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx, src/lib/api/hooks.ts
- `/api/exam/scheduled` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/missions/streak` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/notes` (UNHANDLED-404) — called from src/components/learn/NotesList.tsx
- `/api/notes/upload` (UNHANDLED-404) — called from src/components/learn/NotesList.tsx
- `/api/payment/status` (UNHANDLED-404) — called from src/app/_legacy/pricing/page.tsx
- `/api/personality/analyze` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx
- `/api/personality/report` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx, src/lib/api/hooks.ts
- `/api/personality/session` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx
- `/api/recruiter/candidates` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/resume/:param/improve` (UNHANDLED-404) — called from src/components/career/ResumeUpload.tsx
- `/api/resume/generate-from-vault` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx, src/components/career/ResumeUpload.tsx
- `/api/resume/list` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/resume/structured` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/structured/:param/enhance` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/structured/me` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/suggestions` (UNHANDLED-404) — called from src/components/career/ResumeForm.tsx
- `/api/resume/upload` (UNHANDLED-404) — called from src/components/career/ResumeUpload.tsx
- `/api/study/complete` (UNHANDLED-404) — called from src/app/_legacy/learn/page.tsx
- `/api/teacher/training/submit` (UNHANDLED-404) — called from src/components/teacher/TeacherTraining.tsx
- `/api/trust/evaluate` (UNHANDLED-404) — called from src/app/_legacy/trust/page.tsx
- `/api/trust/score` (UNHANDLED-404) — called from src/lib/api/hooks.ts

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
