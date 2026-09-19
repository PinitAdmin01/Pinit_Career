# Work ledger — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`. Status is not stored here —
it is derived from the code, so a vertical leaves this list by being fixed.

A **vertical** is one session of work: the pages, the handler branches that
serve them, and the dead route under `src/app/api/` that specifies what the
handler should do.

**Bucket** — `A` port to the client (plain datastore CRUD) · `B` needs a trusted
server, move to `backend/` (secrets, signature verification, presigning) ·
`C` genuinely stateless.

## Remaining (32 verticals, 54 broken + 10 partial paths)

| vertical | broken | partial | ok | dead | buckets |
|---|---|---|---|---|---|
| `interview` | 3 | 4 | 1 | 0 | A:3 B:4 |
| `career-twin` | 5 | 0 | 0 | 0 | A:5 |
| `arena` | 4 | 0 | 0 | 0 | A:4 |
| `exam` | 4 | 0 | 0 | 2 | A:4 |
| `personality` | 4 | 0 | 0 | 0 | A:4 |
| `pins` | 4 | 0 | 4 | 0 | A:1 B:3 |
| `resume` | 2 | 2 | 3 | 3 | A:3 B:1 |
| `chat` | 2 | 1 | 0 | 1 | A:3 |
| `sentinel` | 3 | 0 | 0 | 0 | A:3 |
| `analytics` | 2 | 0 | 2 | 0 | A:2 |
| `auth` | 2 | 0 | 13 | 0 | A:2 |
| `avatar` | 1 | 1 | 2 | 0 | A:1 B:1 |
| `attention-span` | 1 | 0 | 2 | 0 | A:1 |
| `code` | 1 | 0 | 2 | 0 | B:1 |
| `codewars` | 1 | 0 | 0 | 0 | A:1 |
| `contact` | 1 | 0 | 0 | 0 | B:1 |
| `github` | 1 | 0 | 0 | 0 | B:1 |
| `internships` | 1 | 0 | 0 | 0 | A:1 |
| `memory` | 1 | 0 | 0 | 0 | A:1 |
| `opportunities` | 0 | 1 | 4 | 0 | A:1 |
| `pathway` | 1 | 0 | 0 | 0 | B:1 |
| `payment` | 1 | 0 | 4 | 0 | A:1 |
| `quest` | 1 | 0 | 0 | 0 | A:1 |
| `quests` | 1 | 0 | 2 | 0 | B:1 |
| `study` | 1 | 0 | 1 | 0 | A:1 |
| `time` | 1 | 0 | 0 | 0 | A:1 |
| `trust` | 1 | 0 | 2 | 0 | A:1 |
| `tts` | 1 | 0 | 0 | 0 | A:1 |
| `v1-auth` | 1 | 0 | 6 | 0 | A:1 |
| `vault` | 0 | 1 | 4 | 0 | A:1 |
| `verify` | 1 | 0 | 0 | 0 | A:1 |
| `xp` | 1 | 0 | 0 | 0 | B:1 |

`dead` = the path is only called from code that is never built, so no visitor can
reach it. Not work. 18 defective paths across the codebase are dead;
they are listed at the end of this file.

## Clean (40 verticals)

`admin` (12) · `admissions` (1) · `advisor` (4) · `attendance` (4) · `cache` (0) · `career-builder` (1) · `career-dna` (6) · `communication` (2) · `consultant` (9) · `documents` (2) · `events` (2) · `exams` (2) · `finance` (4) · `friends` (0) · `gd` (1) · `grievances` (2) · `group-discussion` (3) · `hostel` (6) · `leaderboard` (1) · `library` (4) · `llm` (1) · `maintenance` (2) · `mentor` (0) · `messages` (2) · `missions` (6) · `notes` (0) · `notifications` (3) · `parent` (5) · `placements` (1) · `portfolio` (3) · `projects` (1) · `recruiter` (15) · `research` (2) · `services` (5) · `settings` (4) · `stt` (1) · `student` (1) · `teacher` (4) · `transport` (2) · `university` (5)

## Detail

### interview — 3 broken, 4 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/interview` | BROKEN | STUB | A | client.ts:1999 |
| `/api/interview/assist` | BROKEN | STUB | B | client.ts:1999 |
| `/api/interview/chat` | PARTIAL | STUB | B | client.ts:1999 |
| `/api/interview/evaluate` | PARTIAL | STUB | B | client.ts:1999 |
| `/api/interview/generate-problem` | BROKEN | STUB | B | client.ts:1999 |
| `/api/interview/respond` | PARTIAL | STUB | A | client.ts:1999 |
| `/api/interview/start` | PARTIAL | STUB | A | client.ts:1999 |

### career-twin — 5 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/career-twin` | BROKEN | STUB | A | client.ts:739 |
| `/api/career-twin/readiness` | BROKEN | STUB | A | client.ts:739 |
| `/api/career-twin/results` | BROKEN | STUB | A | client.ts:735 |
| `/api/career-twin/run` | BROKEN | STUB | A | client.ts:736 |
| `/api/career-twin/simulate` | BROKEN | STUB | A | client.ts:736 |

### arena — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/arena/create-room` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/join-room` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/matchmake` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/arena/room/:param` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### exam — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/exam` | BROKEN | STUB | A | client.ts:2012 |
| `/api/exam/available` | BROKEN | STUB | A | client.ts:2008 |
| `/api/exam/results` | BROKEN | STUB | A | client.ts:2011 |
| `/api/exam/sync-result` | BROKEN | STUB | A | client.ts:2010 |

### personality — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/personality` | BROKEN | STUB | A | client.ts:2007 |
| `/api/personality/analyze` | BROKEN | STUB | A | client.ts:2006 |
| `/api/personality/report` | BROKEN | STUB | A | client.ts:2004 |
| `/api/personality/session` | BROKEN | STUB | A | client.ts:2005 |

### pins — 4 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pins/buy-ai-minutes` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/pins/claim-bonus` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/pins/claim-streak-bonus` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |
| `/api/pins/extend-grace` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### resume — 2 broken, 2 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/resume` | BROKEN | STUB | A | client.ts:1283 |
| `/api/resume/analyze` | BROKEN | STUB | B | client.ts:1283 |
| `/api/resume/generate-from-vault` | PARTIAL | STUB | A | client.ts:1283 |
| `/api/resume/structured` | PARTIAL | STUB | A | client.ts:1283 |

### chat — 2 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/chat` | PARTIAL | STUB | A | client.ts:2265 |
| `/api/chat/history` | BROKEN | STUB | A | client.ts:2265 |
| `/api/chat/session` | BROKEN | STUB | A | client.ts:2263 |

### sentinel — 3 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/sentinel` | BROKEN | STUB | A | client.ts:2042 |
| `/api/sentinel/fingerprint` | BROKEN | STUB | A | client.ts:2015 |
| `/api/sentinel/search-similar` | BROKEN | STUB | A | client.ts:2024 |

### analytics — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/analytics/leaderboard` | BROKEN | STUB | A | client.ts:1507 |
| `/api/analytics/leaderboard/preview` | BROKEN | STUB | A | client.ts:1506 |

### auth — 2 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/auth` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |
| `/api/auth/logout` | BROKEN | STUB | A | client.ts:428 |

### avatar — 1 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/avatar` | BROKEN | STUB | A | client.ts:4237 |
| `/api/avatar/chat` | PARTIAL | STUB | B | client.ts:4237 |

### attention-span — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/attention-span` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### code — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/code/evaluate` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### codewars — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/codewars/matches` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### contact — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/contact` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### github — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/github/ingest` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### internships — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/internships` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### memory — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/memory` | BROKEN | STUB | A | client.ts:3579 |

### opportunities — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/opportunities` | PARTIAL | STUB | A | client.ts:1376 |

### pathway — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/pathway/evidence` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### payment — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/payment/plans` | BROKEN | STUB | A | client.ts:1807 |

### quest — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/quest/complete` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### quests — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/quests/enrollment` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |

### study — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/study` | BROKEN | STUB | A | client.ts:2526 |

### time — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/time` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### trust — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/trust` | BROKEN | STUB | A | client.ts:2003 |

### tts — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/tts` | BROKEN | STUB | A | client.ts:3580 |

### v1-auth — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/v1/auth` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### vault — 0 broken, 1 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/vault/items` | PARTIAL | STUB | A | client.ts:1284 |

### verify — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/verify/:param` | BROKEN | UNHANDLED-404 | A | client.ts throws Unhandled API path |

### xp — 1 broken, 0 partial

| path | severity | verdict | bucket | handler |
|---|---|---|---|---|
| `/api/xp/add` | BROKEN | UNHANDLED-404 | B | client.ts throws Unhandled API path |


## Defects in dead code — do not fix (18)

Every call site for these lives in a file no built page imports. Fixing them
changes nothing a visitor can see. Delete the callers, or leave them.

- `/api/cache/hash` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/cache/stats` (UNHANDLED-404) — called from src/lib/voiceCache.ts
- `/api/chat/history/:param` (STUB) — called from src/components/learn/ChatInterface.tsx
- `/api/exam/:param/questions` (STUB) — called from src/app/_legacy/exam/page.tsx
- `/api/exam/scheduled` (STUB) — called from src/lib/api/hooks.ts
- `/api/friends` (UNHANDLED-404) — called from src/app/friends/page.tsx, src/app/friends/[id]/page.tsx
- `/api/friends/:param` (UNHANDLED-404) — called from src/app/friends/[id]/page.tsx
- `/api/friends/challenges` (UNHANDLED-404) — called from src/components/friends/ArenaChallengeModal.tsx, src/components/friends/ArenaChallengesView.tsx
- `/api/friends/messages` (UNHANDLED-404) — called from src/components/friends/FriendChatView.tsx
- `/api/friends/privacy` (UNHANDLED-404) — called from src/app/friends/page.tsx, src/components/friends/PrivacySettingsModal.tsx, src/components/friends/ReportStudentModal.tsx
- `/api/friends/projects` (UNHANDLED-404) — called from src/components/friends/ProjectInviteModal.tsx, src/components/friends/SquadProjectsView.tsx
- `/api/friends/report` (UNHANDLED-404) — called from src/components/friends/ReportStudentModal.tsx
- `/api/mentor/chat` (UNHANDLED-404) — called from src/lib/mentor/avatarDialogue.ts
- `/api/notes` (CAMPUS-404) — called from src/components/learn/NotesList.tsx
- `/api/notes/upload` (CAMPUS-404) — called from src/components/learn/NotesList.tsx
- `/api/resume/:param/improve` (STUB) — called from src/components/career/ResumeUpload.tsx
- `/api/resume/list` (STUB) — called from src/lib/api/hooks.ts
- `/api/resume/suggestions` (STUB) — called from src/components/career/ResumeForm.tsx

## Page files that are never built (18)

- `src/app/friends/page.tsx`
- `src/app/friends/[id]/page.tsx`
- `src/app/pins/page.tsx`
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
