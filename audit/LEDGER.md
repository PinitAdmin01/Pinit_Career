# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages and the routes under
`src/app/api/` that serve them.

**Bucket** — `A` no server route answers the path (or none exports the method):
add the route under `src/app/api/`, or fix the caller.

## Remaining (1 verticals, 1 broken + 0 partial paths)

| vertical | broken | partial | ok | dead | buckets |
|---|---|---|---|---|---|
| `pins` | 1 | 0 | 6 | 0 | A:1 |

`dead` = the path is only called from code that is never built, so no visitor can
reach it. Not work. 20 defective paths across the codebase are dead;
they are listed at the end of this file.

## Clean (72 verticals)

`admin` (8) · `admissions` (1) · `advisor` (4) · `analytics` (1) · `arena` (4) · `attendance` (0) · `attention-span` (3) · `auth` (11) · `avatar` (3) · `cache` (3) · `career-builder` (1) · `career-dna` (0) · `career-twin` (3) · `certificates` (2) · `chat` (3) · `code` (4) · `codewars` (1) · `communication` (2) · `consultant` (7) · `contact` (1) · `documents` (2) · `events` (2) · `exam` (1) · `exams` (4) · `finance` (5) · `friends` (7) · `gd` (1) · `github` (1) · `grievances` (2) · `group-discussion` (2) · `hostel` (6) · `internship` (13) · `internships` (1) · `interview` (6) · `leaderboard` (1) · `library` (4) · `llm` (1) · `maintenance` (2) · `mentor` (1) · `messages` (1) · `missions` (5) · `notes` (2) · `notifications` (3) · `opportunities` (5) · `parent` (3) · `pathway` (1) · `payment` (3) · `personality` (0) · `portfolio` (3) · `projects` (2) · `quest` (1) · `quests` (5) · `recruiter` (12) · `research` (2) · `resume` (3) · `search` (1) · `services` (5) · `settings` (4) · `stt` (1) · `student` (1) · `study` (1) · `teacher` (3) · `time` (1) · `transport` (2) · `trust` (1) · `tts` (1) · `university` (4) · `v1-tts` (0) · `vault` (3) · `verify` (1) · `visuals` (1) · `xp` (1)

## Detail

### pins — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pins/balance` | BROKEN | UNHANDLED-404 | A | no route under src/app/api |


## Defects in dead code — do not fix (20)

Every call site for these lives in a file no built page imports. Fixing them
changes nothing a visitor can see. Delete the callers, or leave them.

- `/api/attendance/identify` (UNHANDLED-404) — called from src/app/_legacy/attendance/page.tsx
- `/api/career-dna/profile` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/career-dna/scores` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/exam/:param/questions` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/available` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/results` (UNHANDLED-404) — called from src/app/_legacy/exam/page.tsx, src/lib/api/hooks.ts
- `/api/exam/scheduled` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/missions/streak` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/payment/status` (UNHANDLED-404) — called from src/app/_legacy/pricing/page.tsx
- `/api/personality/analyze` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx
- `/api/personality/report` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx, src/lib/api/hooks.ts
- `/api/personality/session` (UNHANDLED-404) — called from src/app/_legacy/personality/page.tsx
- `/api/recruiter/candidates` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/resume/list` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/resume/structured` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/structured/:param/enhance` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/structured/me` (UNHANDLED-404) — called from src/app/_legacy/resume/page.tsx
- `/api/resume/suggestions` (UNHANDLED-404) — called from src/components/career/ResumeForm.tsx
- `/api/trust/score` (UNHANDLED-404) — called from src/lib/api/hooks.ts
- `/api/v1/tts` (UNHANDLED-404) — called from src/lib/smartVoiceRouter.ts

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
