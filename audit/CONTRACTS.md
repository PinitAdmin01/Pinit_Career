# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-19T10:37:11.944Z
- **appCodeFiles**: 590
- **verticals**: 72
- **verticalsWithDefects**: 32
- **clientCalledPaths**: 263
- **reachablePaths**: 244
- **brokenOnEveryMethod**: 54
- **brokenOnSomeMethods**: 10
- **defectsInDeadCode**: 18
- **unbuiltPages**: 18
- **reachableSourceFiles**: 520
- **guardBranches**: 182
- **unreachableOrDynamicGuards**: 43
- **campusSwitchCases**: 102
- **campusPrefixes**: 19
- **deadRouteFiles**: 205
- **interceptorBypasses**: []
- **preferLivePrefixes**: 71
- **needsManualCheck**: 0
- **byWorst**: {"REAL":171,"STUB":48,"UNHANDLED-404":32,"COMPUTE":1,"CAMPUS-404":2,"DECLINED":4,"LOCAL-STORE":5}
- **byBucket**: {"OK":171,"A":74,"B":17,"C":1}
- **byLayer**: {"firestoreRouter":186,"campusFallback":45,"none":32}
- **guardsByVerdict**: {"REAL":139,"LOCAL-STORE":5,"STUB":38}

**Verdict** — `REAL` reaches a datastore · `STUB` returns a literal · `THROWS` raises ApiError
· `EXTERNAL` calls out over the network · `COMPUTE` local computation only
· `UNHANDLED-404` no guard matches · `CAMPUS-404` campus switch has no case, default throws
· `BYPASSES-SHIM` interceptor exempts it, so the Firebase `**` rewrite answers with index.html.

**Bucket** — `A` port to client · `B` needs a trusted server · `C` genuinely stateless · `OK` already real.

## Broken no matter how they are called (54)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/analytics/leaderboard` | STUB | A | firestoreRouter | client.ts:1507 | — | 0/1 |
| `/api/analytics/leaderboard/preview` | STUB | A | firestoreRouter | client.ts:1506 | — | 0/1 |
| `/api/arena/create-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/create-room/route.ts | 1/2 |
| `/api/arena/join-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/join-room/route.ts | 1/2 |
| `/api/arena/matchmake` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/matchmake/route.ts | 1/2 |
| `/api/arena/room/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 5/5 |
| `/api/attention-span` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth/logout` | STUB | A | firestoreRouter | client.ts:428 | — | 0/1 |
| `/api/avatar` | STUB | A | firestoreRouter | client.ts:4237 | — | 0/1 |
| `/api/career-twin` | STUB | A | firestoreRouter | client.ts:739 | — | 0/1 |
| `/api/career-twin/readiness` | STUB | A | firestoreRouter | client.ts:739 | /api/career-twin/readiness/route.ts | 1/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:735 | /api/career-twin/results/route.ts | 0/4 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:736 | — | 1/3 |
| `/api/career-twin/simulate` | STUB | A | firestoreRouter | client.ts:736 | — | 0/1 |
| `/api/chat/history` | STUB | A | firestoreRouter | client.ts:2265 | — | 0/1 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:2263 | — | 1/3 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/contact` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/contact/route.ts | 1/2 |
| `/api/exam` | STUB | A | firestoreRouter | client.ts:2012 | — | 0/2 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:2008 | — | 0/2 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:2011 | — | 0/3 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:2010 | — | 1/3 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview` | STUB | A | firestoreRouter | client.ts:1999 | — | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/memory` | STUB | A | firestoreRouter | client.ts:3579 | — | 0/1 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment/plans` | STUB | A | firestoreRouter | client.ts:1807 | — | 0/3 |
| `/api/personality` | STUB | A | firestoreRouter | client.ts:2007 | — | 0/1 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:2006 | — | 0/2 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:2004 | — | 0/3 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:2005 | — | 0/2 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-bonus` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/pins/claim-bonus/route.ts | 0/1 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 2/4 |
| `/api/quests/enrollment` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/enrollment/route.ts | 5/10 |
| `/api/resume` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/1 |
| `/api/resume/analyze` | STUB | B | firestoreRouter | client.ts:1283 | /api/resume/analyze/route.ts | 0/1 |
| `/api/sentinel` | STUB | A | firestoreRouter | client.ts:2042 | — | 0/1 |
| `/api/sentinel/fingerprint` | STUB | A | firestoreRouter | client.ts:2015 | — | 0/1 |
| `/api/sentinel/search-similar` | STUB | A | firestoreRouter | client.ts:2024 | — | 0/1 |
| `/api/study` | STUB | A | firestoreRouter | client.ts:2526 | — | 0/1 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/trust` | STUB | A | firestoreRouter | client.ts:2003 | — | 0/1 |
| `/api/tts` | STUB | A | firestoreRouter | client.ts:3580 | /api/tts/route.ts | 3/7 |
| `/api/v1/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/verify/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |

## Broken only on some methods (10)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.

- `/api/avatar/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/evaluate` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/respond` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/start` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/opportunities` — broken on POST, PUT, PATCH, DELETE; works on GET
- `/api/resume/generate-from-vault` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/structured` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault/items` — broken on POST, PUT, PATCH, DELETE; works on GET

## All paths (263)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin` | REAL | OK | firestoreRouter | client.ts:3222 | — | 0/2 |
| `/api/admin/audit-log` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/audit-log/route.ts | 0/2 |
| `/api/admin/audit-log/add` | REAL | OK | firestoreRouter | client.ts:3222 | — | 0/1 |
| `/api/admin/audit-log/list` | REAL | OK | firestoreRouter | client.ts:3222 | — | 0/1 |
| `/api/admin/broadcast` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/broadcast/route.ts | 0/1 |
| `/api/admin/dashboard` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/dashboard/route.ts | 0/1 |
| `/api/admin/fraud-alerts` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/fraud-alerts/route.ts | 0/1 |
| `/api/admin/metrics-summary` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/metrics-summary/route.ts | 0/1 |
| `/api/admin/platform-stats` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/platform-stats/route.ts | 0/1 |
| `/api/admin/users` | REAL | OK | firestoreRouter | client.ts:3222 | /api/admin/users/route.ts | 1/12 |
| `/api/admin/users/:param` | REAL | OK | firestoreRouter | client.ts:3222 | — | 1/2 |
| `/api/admin/users/:param/role` | REAL | OK | firestoreRouter | client.ts:3222 | — | 1/2 |
| `/api/admissions/apply` | REAL | OK | campusFallback | campusFallback.ts:158 | — | 1/3 |
| `/api/advisor/admin/alert` | REAL | OK | campusFallback | campusFallback.ts:240 | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | REAL | OK | campusFallback | campusFallback.ts:238 | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | REAL | OK | campusFallback | campusFallback.ts:234 | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | REAL | OK | campusFallback | campusFallback.ts:236 | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/analytics` | REAL | OK | firestoreRouter | client.ts:1508 | — | 0/1 |
| `/api/analytics/dashboard` | REAL | OK | firestoreRouter | client.ts:1505 | — | 0/4 |
| `/api/analytics/leaderboard` | STUB | A | firestoreRouter | client.ts:1507 | — | 0/1 |
| `/api/analytics/leaderboard/preview` | STUB | A | firestoreRouter | client.ts:1506 | — | 0/1 |
| `/api/arena/create-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/create-room/route.ts | 1/2 |
| `/api/arena/join-room` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/join-room/route.ts | 1/2 |
| `/api/arena/matchmake` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/arena/matchmake/route.ts | 1/2 |
| `/api/arena/room/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 5/5 |
| `/api/attendance` | REAL | OK | firestoreRouter | client.ts:4297 | — | 0/1 |
| `/api/attendance/identify` | REAL | OK | firestoreRouter | client.ts:4294 | — | 0/2 |
| `/api/attendance/logs` | REAL | OK | firestoreRouter | client.ts:4267 | — | 0/1 |
| `/api/attendance/report` | REAL | OK | firestoreRouter | client.ts:4287 | — | 0/1 |
| `/api/attention-span` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/attention-span/analytics` | REAL | OK | firestoreRouter | client.ts:2800 | /api/attention-span/analytics/route.ts | 1/3 |
| `/api/attention-span/leaderboard` | REAL | OK | firestoreRouter | client.ts:2800 | /api/attention-span/leaderboard/route.ts | 1/3 |
| `/api/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/auth/face/challenge` | REAL | OK | firestoreRouter | client.ts:549 | /api/auth/face/challenge/route.ts | 0/3 |
| `/api/auth/face/enroll` | REAL | OK | firestoreRouter | client.ts:545 | /api/auth/face/enroll/route.ts | 2/5 |
| `/api/auth/face/enrolled` | REAL | OK | firestoreRouter | client.ts:541 | — | 1/3 |
| `/api/auth/face/verify` | REAL | OK | firestoreRouter | client.ts:549 | /api/auth/face/verify/route.ts | 1/4 |
| `/api/auth/forgot-password` | REAL | OK | firestoreRouter | client.ts:527 | — | 0/2 |
| `/api/auth/logout` | STUB | A | firestoreRouter | client.ts:428 | — | 0/1 |
| `/api/auth/me` | REAL | OK | firestoreRouter | client.ts:427 | /api/auth/me/route.ts | 0/5 |
| `/api/auth/onboarding` | REAL | OK | firestoreRouter | client.ts:441 | /api/auth/onboarding/route.ts | 5/11 |
| `/api/auth/profile` | REAL | OK | firestoreRouter | client.ts:429 | — | 12/26 |
| `/api/auth/reset-password` | REAL | OK | firestoreRouter | client.ts:535 | — | 0/2 |
| `/api/auth/session` | REAL | OK | firestoreRouter | client.ts:559 | /api/auth/session/route.ts | 5/10 |
| `/api/auth/signup` | REAL | OK | firestoreRouter | client.ts:559 | — | 0/1 |
| `/api/auth/teacher` | REAL | OK | firestoreRouter | client.ts:440 | — | 1/3 |
| `/api/auth/vault-exchange` | REAL | OK | firestoreRouter | client.ts:559 | /api/auth/vault-exchange/route.ts | 1/2 |
| `/api/avatar` | STUB | A | firestoreRouter | client.ts:4237 | — | 0/1 |
| `/api/avatar/chat` | STUB | B | firestoreRouter | client.ts:4237 | /api/avatar/chat/route.ts | 2/6 |
| `/api/avatar/context` | REAL | OK | firestoreRouter | client.ts:3778 | /api/avatar/context/route.ts | 2/5 |
| `/api/avatar/memory` | REAL | OK | firestoreRouter | client.ts:3785 | /api/avatar/memory/route.ts | 2/5 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-builder/generate` | REAL | OK | firestoreRouter | client.ts:757 | — | 0/3 |
| `/api/career-dna/archetype` | REAL | OK | firestoreRouter | client.ts:732 | — | 0/1 |
| `/api/career-dna/calculate` | REAL | OK | firestoreRouter | client.ts:733 | — | 0/1 |
| `/api/career-dna/history` | REAL | OK | firestoreRouter | client.ts:734 | — | 0/1 |
| `/api/career-dna/profile` | REAL | OK | firestoreRouter | client.ts:731 | — | 0/2 |
| `/api/career-dna/recalculate` | REAL | OK | firestoreRouter | client.ts:733 | — | 0/1 |
| `/api/career-dna/scores` | REAL | OK | firestoreRouter | client.ts:730 | — | 0/2 |
| `/api/career-twin` | STUB | A | firestoreRouter | client.ts:739 | — | 0/1 |
| `/api/career-twin/readiness` | STUB | A | firestoreRouter | client.ts:739 | /api/career-twin/readiness/route.ts | 1/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:735 | /api/career-twin/results/route.ts | 0/4 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:736 | — | 1/3 |
| `/api/career-twin/simulate` | STUB | A | firestoreRouter | client.ts:736 | — | 0/1 |
| `/api/chat` | STUB | A | firestoreRouter | client.ts:2265 | — | 1/4 |
| `/api/chat/history` | STUB | A | firestoreRouter | client.ts:2265 | — | 0/1 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:2264 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:2263 | — | 1/3 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/code/run-java` | REAL | OK | firestoreRouter | client.ts:2111 | /api/code/run-java/route.ts | 1/3 |
| `/api/code/run-python` | REAL | OK | firestoreRouter | client.ts:2044 | /api/code/run-python/route.ts | 1/3 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/communication/all` | REAL | OK | campusFallback | campusFallback.ts:210 | /api/communication/all/route.ts | 0/1 |
| `/api/communication/evaluate` | REAL | OK | firestoreRouter | client.ts:584 | — | 0/2 |
| `/api/consultant` | REAL | OK | firestoreRouter | client.ts:3099 | — | 0/2 |
| `/api/consultant/analytics` | REAL | OK | firestoreRouter | client.ts:3099 | /api/consultant/analytics/route.ts | 0/2 |
| `/api/consultant/pipeline` | REAL | OK | firestoreRouter | client.ts:3099 | /api/consultant/pipeline/route.ts | 0/2 |
| `/api/consultant/sessions` | REAL | OK | firestoreRouter | client.ts:3099 | — | 1/4 |
| `/api/consultant/student` | REAL | OK | firestoreRouter | client.ts:3099 | — | 0/6 |
| `/api/consultant/student/:param` | REAL | OK | firestoreRouter | client.ts:3099 | — | 1/2 |
| `/api/consultant/student/:param/task` | REAL | OK | firestoreRouter | client.ts:3099 | — | 1/2 |
| `/api/consultant/student/:param/verify-document` | REAL | OK | firestoreRouter | client.ts:3099 | — | 1/2 |
| `/api/consultant/student/add` | REAL | OK | firestoreRouter | client.ts:3099 | /api/consultant/student/add/route.ts | 1/3 |
| `/api/contact` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/contact/route.ts | 1/2 |
| `/api/documents/mine` | REAL | OK | campusFallback | campusFallback.ts:120 | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | REAL | OK | campusFallback | campusFallback.ts:122 | /api/documents/request/route.ts | 0/1 |
| `/api/events/rsvp` | REAL | OK | campusFallback | campusFallback.ts:256 | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | REAL | OK | campusFallback | campusFallback.ts:254 | /api/events/stats/route.ts | 0/1 |
| `/api/exam` | STUB | A | firestoreRouter | client.ts:2012 | — | 0/2 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:2009 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:2008 | — | 0/2 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:2011 | — | 0/3 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:2012 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:2010 | — | 1/3 |
| `/api/exams/student-results` | REAL | OK | campusFallback | campusFallback.ts:97 | /api/exams/student-results/route.ts | 1/2 |
| `/api/exams/student-schedule` | REAL | OK | campusFallback | campusFallback.ts:95 | /api/exams/student-schedule/route.ts | 0/1 |
| `/api/finance/apply-scholarship` | REAL | OK | campusFallback | campusFallback.ts:79 | /api/finance/apply-scholarship/route.ts | 0/1 |
| `/api/finance/pay-due` | REAL | OK | campusFallback | campusFallback.ts:75 | /api/finance/pay-due/route.ts | 0/1 |
| `/api/finance/scholarships` | COMPUTE | C | campusFallback | campusFallback.ts:77 | /api/finance/scholarships/route.ts | 0/1 |
| `/api/finance/student-dues` | REAL | OK | campusFallback | campusFallback.ts:73 | /api/finance/student-dues/route.ts | 1/2 |
| `/api/friends` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/friends/route.ts | 5/10 |
| `/api/friends/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/friends/challenges` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/friends/challenges/route.ts | 3/6 |
| `/api/friends/messages` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/friends/messages/route.ts | 2/3 |
| `/api/friends/privacy` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/friends/privacy/route.ts | 5/10 |
| `/api/friends/projects` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/friends/projects/route.ts | 3/6 |
| `/api/friends/report` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/friends/report/route.ts | 1/2 |
| `/api/gd/history` | REAL | OK | firestoreRouter | client.ts:2267 | /api/gd/history/route.ts | 3/7 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/grievances/stats` | REAL | OK | campusFallback | campusFallback.ts:243 | /api/grievances/stats/route.ts | 0/1 |
| `/api/grievances/submit` | REAL | OK | campusFallback | campusFallback.ts:245 | /api/grievances/submit/route.ts | 0/1 |
| `/api/group-discussion/bot-reply` | REAL | OK | firestoreRouter | client.ts:2437 | /api/group-discussion/bot-reply/route.ts | 2/5 |
| `/api/group-discussion/evaluate` | REAL | OK | firestoreRouter | client.ts:2464 | /api/group-discussion/evaluate/route.ts | 1/3 |
| `/api/group-discussion/messages` | REAL | OK | firestoreRouter | client.ts:2420 | — | 0/2 |
| `/api/hostel/checkout-visitor` | REAL | OK | campusFallback | campusFallback.ts:68 | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | REAL | OK | campusFallback | campusFallback.ts:60 | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | REAL | OK | campusFallback | campusFallback.ts:62 | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | REAL | OK | campusFallback | campusFallback.ts:66 | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | REAL | OK | campusFallback | campusFallback.ts:58 | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | REAL | OK | campusFallback | campusFallback.ts:56 | /api/hostel/stats/route.ts | 0/1 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview` | STUB | A | firestoreRouter | client.ts:1999 | — | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/chat/route.ts | 1/3 |
| `/api/interview/evaluate` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/evaluate/route.ts | 2/5 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1999 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | REAL | OK | firestoreRouter | client.ts:1986 | /api/interview/history/route.ts | 2/5 |
| `/api/interview/respond` | STUB | A | firestoreRouter | client.ts:1999 | — | 0/1 |
| `/api/interview/start` | STUB | A | firestoreRouter | client.ts:1999 | /api/interview/start/route.ts | 2/5 |
| `/api/leaderboard` | REAL | OK | firestoreRouter | client.ts:1390 | /api/leaderboard/route.ts | 1/2 |
| `/api/library/books` | REAL | OK | campusFallback | campusFallback.ts:84 | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | REAL | OK | campusFallback | campusFallback.ts:86 | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | REAL | OK | campusFallback | campusFallback.ts:90 | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | REAL | OK | campusFallback | campusFallback.ts:88 | /api/library/return/route.ts | 0/1 |
| `/api/llm` | REAL | OK | firestoreRouter | client.ts:4252 | /api/llm/route.ts | 3/7 |
| `/api/maintenance/report` | REAL | OK | campusFallback | campusFallback.ts:194 | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | REAL | OK | campusFallback | campusFallback.ts:192 | /api/maintenance/stats/route.ts | 0/1 |
| `/api/memory` | STUB | A | firestoreRouter | client.ts:3579 | — | 0/1 |
| `/api/mentor/chat` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/mentor/chat/route.ts | 1/2 |
| `/api/messages/direct` | REAL | OK | firestoreRouter | client.ts:3501 | /api/messages/direct/route.ts | 1/3 |
| `/api/messages/unread` | REAL | OK | firestoreRouter | client.ts:3497 | — | 0/1 |
| `/api/missions/generate-custom-skill` | REAL | OK | firestoreRouter | client.ts:579 | — | 1/3 |
| `/api/missions/history` | REAL | OK | firestoreRouter | client.ts:563 | /api/missions/history/route.ts | 0/2 |
| `/api/missions/roleplay` | REAL | OK | firestoreRouter | client.ts:703 | /api/missions/roleplay/route.ts | 3/7 |
| `/api/missions/streak` | REAL | OK | firestoreRouter | client.ts:729 | — | 0/2 |
| `/api/missions/submit` | REAL | OK | firestoreRouter | client.ts:564 | /api/missions/submit/route.ts | 2/5 |
| `/api/missions/today` | REAL | OK | firestoreRouter | client.ts:562 | /api/missions/today/route.ts | 0/3 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications` | REAL | OK | firestoreRouter | client.ts:1368 | /api/notifications/route.ts | 0/3 |
| `/api/notifications/:param/read` | REAL | OK | firestoreRouter | client.ts:1370 | — | 1/2 |
| `/api/notifications/mark-all-read` | REAL | OK | firestoreRouter | client.ts:1369 | /api/notifications/mark-all-read/route.ts | 1/3 |
| `/api/opportunities` | STUB | A | firestoreRouter | client.ts:1376 | — | 0/4 |
| `/api/opportunities/applications` | REAL | OK | firestoreRouter | client.ts:1388 | — | 0/2 |
| `/api/opportunities/apply` | REAL | OK | firestoreRouter | client.ts:1381 | — | 1/3 |
| `/api/opportunities/feed` | REAL | OK | firestoreRouter | client.ts:1376 | — | 0/2 |
| `/api/opportunities/match` | REAL | OK | firestoreRouter | client.ts:1382 | — | 0/2 |
| `/api/parent` | REAL | OK | firestoreRouter | client.ts:2565 | — | 0/2 |
| `/api/parent/link-student` | REAL | OK | firestoreRouter | client.ts:2565 | /api/parent/link-student/route.ts | 1/3 |
| `/api/parent/student` | REAL | OK | firestoreRouter | client.ts:2565 | — | 0/2 |
| `/api/parent/student/:param/overview` | REAL | OK | firestoreRouter | client.ts:2527 | — | 0/1 |
| `/api/parent/students` | REAL | OK | firestoreRouter | client.ts:2565 | /api/parent/students/route.ts | 0/3 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment` | REAL | OK | firestoreRouter | client.ts:1815 | — | 0/1 |
| `/api/payment/create-order` | REAL | OK | firestoreRouter | client.ts:1808 | /api/payment/create-order/route.ts | 1/8 |
| `/api/payment/plans` | STUB | A | firestoreRouter | client.ts:1807 | — | 0/3 |
| `/api/payment/status` | REAL | OK | firestoreRouter | client.ts:1780 | — | 0/3 |
| `/api/payment/verify` | REAL | OK | firestoreRouter | client.ts:1812 | /api/payment/verify/route.ts | 2/9 |
| `/api/personality` | STUB | A | firestoreRouter | client.ts:2007 | — | 0/1 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:2006 | — | 0/2 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:2004 | — | 0/3 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:2005 | — | 0/2 |
| `/api/pins/balance` | REAL | OK | firestoreRouter | client.ts:1747 | — | 0/2 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-bonus` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/pins/claim-bonus/route.ts | 0/1 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/earn` | REAL | OK | firestoreRouter | client.ts:1751 | /api/pins/earn/route.ts | 2/5 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/pins/purchase` | REAL | OK | firestoreRouter | client.ts:1775 | — | 0/1 |
| `/api/pins/spend` | REAL | OK | firestoreRouter | client.ts:1763 | /api/pins/spend/route.ts | 1/3 |
| `/api/placements/push` | REAL | OK | firestoreRouter | client.ts:3634 | — | 0/1 |
| `/api/portfolio/analyze-certificate` | REAL | OK | firestoreRouter | client.ts:2837 | /api/portfolio/analyze-certificate/route.ts | 1/3 |
| `/api/portfolio/verify-endorsement` | REAL | OK | firestoreRouter | client.ts:2816 | /api/portfolio/verify-endorsement/route.ts | 2/5 |
| `/api/portfolio/verify-exam` | REAL | OK | firestoreRouter | client.ts:2996 | /api/portfolio/verify-exam/route.ts | 1/3 |
| `/api/projects/generate` | REAL | OK | firestoreRouter | client.ts:1510 | /api/projects/generate/route.ts | 1/3 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 2/4 |
| `/api/quests/enrollment` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/quests/enrollment/route.ts | 5/10 |
| `/api/quests/generate-slides` | REAL | OK | firestoreRouter | client.ts:3789 | — | 0/1 |
| `/api/quests/verify` | REAL | OK | firestoreRouter | client.ts:3587 | /api/quests/verify/route.ts | 0/2 |
| `/api/recruiter` | REAL | OK | firestoreRouter | client.ts:2638 | — | 0/2 |
| `/api/recruiter/activity-log` | REAL | OK | firestoreRouter | client.ts:2638 | — | 1/2 |
| `/api/recruiter/analytics` | REAL | OK | firestoreRouter | client.ts:2638 | — | 0/2 |
| `/api/recruiter/applications` | REAL | OK | firestoreRouter | client.ts:2638 | — | 1/4 |
| `/api/recruiter/candidate` | REAL | OK | firestoreRouter | client.ts:2638 | — | 0/2 |
| `/api/recruiter/candidate/:param` | REAL | OK | firestoreRouter | client.ts:2638 | — | 0/1 |
| `/api/recruiter/candidates` | REAL | OK | firestoreRouter | client.ts:2638 | — | 0/2 |
| `/api/recruiter/company` | REAL | OK | firestoreRouter | client.ts:2638 | — | 1/4 |
| `/api/recruiter/contact-request` | REAL | OK | firestoreRouter | client.ts:2638 | /api/recruiter/contact-request/route.ts | 1/3 |
| `/api/recruiter/jobs` | REAL | OK | firestoreRouter | client.ts:2638 | — | 2/8 |
| `/api/recruiter/jobs/:param` | REAL | OK | firestoreRouter | client.ts:2638 | — | 1/2 |
| `/api/recruiter/pipeline` | REAL | OK | firestoreRouter | client.ts:2638 | /api/recruiter/pipeline/route.ts | 0/2 |
| `/api/recruiter/schedule-interview` | REAL | OK | firestoreRouter | client.ts:2638 | /api/recruiter/schedule-interview/route.ts | 1/3 |
| `/api/recruiter/shortlist` | REAL | OK | firestoreRouter | client.ts:2638 | /api/recruiter/shortlist/route.ts | 1/3 |
| `/api/recruiter/visibility` | REAL | OK | firestoreRouter | client.ts:2773 | /api/recruiter/visibility/route.ts | 2/6 |
| `/api/research/publish-paper` | REAL | OK | campusFallback | campusFallback.ts:266 | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | REAL | OK | campusFallback | campusFallback.ts:264 | /api/research/stats/route.ts | 0/1 |
| `/api/resume` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/1 |
| `/api/resume/:param/improve` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/1 |
| `/api/resume/analyze` | STUB | B | firestoreRouter | client.ts:1283 | /api/resume/analyze/route.ts | 0/1 |
| `/api/resume/generate-from-vault` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/3 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/1 |
| `/api/resume/structured` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/2 |
| `/api/resume/structured/:param/enhance` | REAL | OK | firestoreRouter | client.ts:1238 | — | 0/1 |
| `/api/resume/structured/me` | REAL | OK | firestoreRouter | client.ts:740 | — | 0/2 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1283 | — | 0/1 |
| `/api/resume/upload` | REAL | OK | firestoreRouter | client.ts:857 | — | 1/4 |
| `/api/sentinel` | STUB | A | firestoreRouter | client.ts:2042 | — | 0/1 |
| `/api/sentinel/fingerprint` | STUB | A | firestoreRouter | client.ts:2015 | — | 0/1 |
| `/api/sentinel/search-similar` | STUB | A | firestoreRouter | client.ts:2024 | — | 0/1 |
| `/api/services/apply-leave` | REAL | OK | campusFallback | campusFallback.ts:221 | /api/services/apply-leave/route.ts | 1/2 |
| `/api/services/book-appointment` | REAL | OK | campusFallback | campusFallback.ts:225 | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | REAL | OK | campusFallback | campusFallback.ts:227 | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | REAL | OK | campusFallback | campusFallback.ts:223 | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | REAL | OK | campusFallback | campusFallback.ts:219 | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | DECLINED | A | campusFallback | campusFallback.ts:286 | — | 0/1 |
| `/api/settings/migration/execute` | DECLINED | A | campusFallback | campusFallback.ts:286 | — | 0/1 |
| `/api/settings/migration/validate` | DECLINED | A | campusFallback | campusFallback.ts:286 | — | 0/1 |
| `/api/settings/rollout/feedback` | DECLINED | A | campusFallback | campusFallback.ts:286 | — | 0/1 |
| `/api/stt` | REAL | OK | firestoreRouter | client.ts:3581 | /api/stt/route.ts | 2/5 |
| `/api/student/activity` | REAL | OK | firestoreRouter | client.ts:3381 | /api/student/activity/route.ts | 6/14 |
| `/api/study` | STUB | A | firestoreRouter | client.ts:2526 | — | 0/1 |
| `/api/study/complete` | REAL | OK | firestoreRouter | client.ts:2525 | — | 1/3 |
| `/api/teacher/inbox` | REAL | OK | firestoreRouter | client.ts:3493 | /api/teacher/inbox/route.ts | 0/1 |
| `/api/teacher/list` | REAL | OK | firestoreRouter | client.ts:3477 | — | 0/1 |
| `/api/teacher/students` | REAL | OK | firestoreRouter | client.ts:3455 | — | 0/3 |
| `/api/teacher/training/submit` | REAL | OK | firestoreRouter | client.ts:3521 | — | 1/3 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/transport/register` | REAL | OK | campusFallback | campusFallback.ts:106 | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | REAL | OK | campusFallback | campusFallback.ts:104 | /api/transport/stats/route.ts | 0/1 |
| `/api/trust` | STUB | A | firestoreRouter | client.ts:2003 | — | 0/1 |
| `/api/trust/evaluate` | REAL | OK | firestoreRouter | client.ts:2002 | — | 1/3 |
| `/api/trust/score` | REAL | OK | firestoreRouter | client.ts:2001 | — | 0/2 |
| `/api/tts` | STUB | A | firestoreRouter | client.ts:3580 | /api/tts/route.ts | 3/7 |
| `/api/university` | REAL | OK | firestoreRouter | client.ts:3084 | — | 0/1 |
| `/api/university/dashboard` | REAL | OK | firestoreRouter | client.ts:3084 | — | 0/2 |
| `/api/university/employability-report` | REAL | OK | firestoreRouter | client.ts:3084 | — | 0/2 |
| `/api/university/placement-roster` | REAL | OK | firestoreRouter | client.ts:3084 | /api/university/placement-roster/route.ts | 1/1 |
| `/api/university/skill-gaps` | REAL | OK | firestoreRouter | client.ts:3084 | — | 0/2 |
| `/api/v1/auth` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 0/1 |
| `/api/v1/auth/devices` | LOCAL-STORE | A | firestoreRouter | client.ts:417 | — | 0/1 |
| `/api/v1/auth/exchange-session` | LOCAL-STORE | A | firestoreRouter | client.ts:309 | — | 1/3 |
| `/api/v1/auth/logout-all` | LOCAL-STORE | A | firestoreRouter | client.ts:403 | — | 1/3 |
| `/api/v1/auth/vault-approve` | LOCAL-STORE | A | firestoreRouter | client.ts:269 | — | 0/2 |
| `/api/v1/auth/vault-challenge` | REAL | OK | firestoreRouter | client.ts:155 | — | 0/2 |
| `/api/v1/auth/vault-stream` | LOCAL-STORE | A | firestoreRouter | client.ts:234 | — | 0/1 |
| `/api/vault` | REAL | OK | firestoreRouter | client.ts:1296 | — | 1/7 |
| `/api/vault/delete` | REAL | OK | firestoreRouter | client.ts:1074 | /api/vault/delete/route.ts | 2/6 |
| `/api/vault/items` | STUB | A | firestoreRouter | client.ts:1284 | — | 0/1 |
| `/api/vault/stats` | REAL | OK | firestoreRouter | client.ts:1285 | — | 0/1 |
| `/api/vault/upload` | REAL | OK | firestoreRouter | client.ts:1298 | /api/vault/upload/route.ts | 0/6 |
| `/api/verify/:param` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |
