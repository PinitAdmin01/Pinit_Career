# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-28T06:08:05.571Z
- **appCodeFiles**: 630
- **verticals**: 70
- **verticalsWithDefects**: 15
- **clientCalledPaths**: 218
- **reachablePaths**: 182
- **brokenOnEveryMethod**: 32
- **brokenOnSomeMethods**: 0
- **defectsInDeadCode**: 33
- **unbuiltPages**: 15
- **reachableSourceFiles**: 528
- **guardBranches**: 0
- **unreachableOrDynamicGuards**: 0
- **campusSwitchCases**: 0
- **campusPrefixes**: 0
- **deadRouteFiles**: 223
- **interceptorBypasses**: []
- **preferLivePrefixes**: 71
- **needsManualCheck**: 0
- **byWorst**: {"SERVER":153,"UNHANDLED-404":65}
- **byBucket**: {"OK":153,"A":65}
- **byLayer**: {"server":153,"none":65}
- **guardsByVerdict**: {}

**Verdict** — `SERVER` a route under `src/app/api/` exports the method
· `UNHANDLED-404` no route serves the path, or the route does not export the method.
Methods are not read from call sites here; `npm run audit:contracts` runs
`scripts/verify/verify_api_parity.ts` next, which checks each call's method.

**Bucket** — `OK` a server route answers it · `A` nothing does: add the route or fix the caller.

## Broken no matter how they are called (32)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/analytics/dashboard` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/3 |
| `/api/auth/face/enrolled` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/auth/profile` | UNHANDLED-404 | A | none | no route under src/app/api | — | 12/24 |
| `/api/auth/teacher` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/cache/clear` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/communication/evaluate` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/consultant/sessions` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/consultant/student/:param/task` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/exams/results` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exams/schedule` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/finance/dues` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/missions/generate-custom-skill` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/news` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/opportunities` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/opportunities/applications` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/opportunities/apply` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/opportunities/feed` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/opportunities/match` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/pins/balance` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/activity-log` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/recruiter/analytics` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/applications` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/recruiter/candidate/:param` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/company` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/recruiter/jobs` | UNHANDLED-404 | A | none | no route under src/app/api | — | 2/5 |
| `/api/recruiter/jobs/:param` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/settings/erp/sync` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/migration/execute` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/migration/validate` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/rollout/feedback` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/teacher/students` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/vault` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |

## Broken only on some methods (0)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.



## All paths (218)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin/audit-log` | SERVER | OK | server | src/app/api/admin/audit-log/route.ts | /api/admin/audit-log/route.ts | 0/1 |
| `/api/admin/broadcast` | SERVER | OK | server | src/app/api/admin/broadcast/route.ts | /api/admin/broadcast/route.ts | 1/2 |
| `/api/admin/metrics-summary` | SERVER | OK | server | src/app/api/admin/metrics-summary/route.ts | /api/admin/metrics-summary/route.ts | 0/1 |
| `/api/admin/users` | SERVER | OK | server | src/app/api/admin/users/route.ts | /api/admin/users/route.ts | 1/3 |
| `/api/admin/users/:param` | SERVER | OK | server | src/app/api/admin/users/[id]/route.ts | /api/admin/users/[id]/route.ts | 1/2 |
| `/api/admin/users/:param/role` | SERVER | OK | server | src/app/api/admin/users/[id]/role/route.ts | /api/admin/users/[id]/role/route.ts | 2/4 |
| `/api/admin/users/:param/score-override` | SERVER | OK | server | src/app/api/admin/users/[id]/score-override/route.ts | /api/admin/users/[id]/score-override/route.ts | 1/2 |
| `/api/admin/users/:param/suspend` | SERVER | OK | server | src/app/api/admin/users/[id]/suspend/route.ts | /api/admin/users/[id]/suspend/route.ts | 1/2 |
| `/api/admissions/apply` | SERVER | OK | server | src/app/api/admissions/apply/route.ts | /api/admissions/apply/route.ts | 1/2 |
| `/api/advisor/admin/alert` | SERVER | OK | server | src/app/api/advisor/admin/alert/route.ts | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | SERVER | OK | server | src/app/api/advisor/admin/risks/route.ts | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | SERVER | OK | server | src/app/api/advisor/performance/route.ts | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | SERVER | OK | server | src/app/api/advisor/quest/complete/route.ts | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/analytics/dashboard` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/3 |
| `/api/arena/create-room` | SERVER | OK | server | src/app/api/arena/create-room/route.ts | /api/arena/create-room/route.ts | 1/2 |
| `/api/arena/join-room` | SERVER | OK | server | src/app/api/arena/join-room/route.ts | /api/arena/join-room/route.ts | 1/2 |
| `/api/arena/matchmake` | SERVER | OK | server | src/app/api/arena/matchmake/route.ts | /api/arena/matchmake/route.ts | 1/2 |
| `/api/arena/room/:param` | SERVER | OK | server | src/app/api/arena/room/[roomCode]/route.ts | /api/arena/room/[roomCode]/route.ts | 5/5 |
| `/api/attendance/identify` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/attention-span/analytics` | SERVER | OK | server | src/app/api/attention-span/analytics/route.ts | /api/attention-span/analytics/route.ts | 2/4 |
| `/api/attention-span/leaderboard` | SERVER | OK | server | src/app/api/attention-span/leaderboard/route.ts | /api/attention-span/leaderboard/route.ts | 1/2 |
| `/api/attention-span/progress` | SERVER | OK | server | src/app/api/attention-span/progress/route.ts | /api/attention-span/progress/route.ts | 2/4 |
| `/api/auth/demo` | SERVER | OK | server | src/app/api/auth/demo/route.ts | /api/auth/demo/route.ts | 1/2 |
| `/api/auth/face/enroll` | SERVER | OK | server | src/app/api/auth/face/enroll/route.ts | /api/auth/face/enroll/route.ts | 2/4 |
| `/api/auth/face/enrolled` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/auth/face/nonce` | SERVER | OK | server | src/app/api/auth/face/nonce/route.ts | /api/auth/face/nonce/route.ts | 1/2 |
| `/api/auth/face/verify` | SERVER | OK | server | src/app/api/auth/face/verify/route.ts | /api/auth/face/verify/route.ts | 1/2 |
| `/api/auth/me` | SERVER | OK | server | src/app/api/auth/me/route.ts | /api/auth/me/route.ts | 0/4 |
| `/api/auth/onboarding` | SERVER | OK | server | src/app/api/auth/onboarding/route.ts | /api/auth/onboarding/route.ts | 5/10 |
| `/api/auth/profile` | UNHANDLED-404 | A | none | no route under src/app/api | — | 12/24 |
| `/api/auth/session` | SERVER | OK | server | src/app/api/auth/session/route.ts | /api/auth/session/route.ts | 5/10 |
| `/api/auth/teacher` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/auth/vault-exchange` | SERVER | OK | server | src/app/api/auth/vault-exchange/route.ts | /api/auth/vault-exchange/route.ts | 1/2 |
| `/api/avatar/chat` | SERVER | OK | server | src/app/api/avatar/chat/route.ts | /api/avatar/chat/route.ts | 2/5 |
| `/api/avatar/context` | SERVER | OK | server | src/app/api/avatar/context/route.ts | /api/avatar/context/route.ts | 2/4 |
| `/api/avatar/memory` | SERVER | OK | server | src/app/api/avatar/memory/route.ts | /api/avatar/memory/route.ts | 2/4 |
| `/api/cache/clear` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/career-builder/generate` | SERVER | OK | server | src/app/api/career-builder/generate/route.ts | /api/career-builder/generate/route.ts | 0/2 |
| `/api/career-dna/profile` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/career-dna/scores` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/career-twin/readiness` | SERVER | OK | server | src/app/api/career-twin/readiness/route.ts | /api/career-twin/readiness/route.ts | 1/1 |
| `/api/career-twin/results` | SERVER | OK | server | src/app/api/career-twin/results/route.ts | /api/career-twin/results/route.ts | 0/3 |
| `/api/career-twin/run` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/certificates/course` | SERVER | OK | server | src/app/api/certificates/course/route.ts | /api/certificates/course/route.ts | 0/1 |
| `/api/certificates/roadmap` | SERVER | OK | server | src/app/api/certificates/roadmap/route.ts | /api/certificates/roadmap/route.ts | 0/1 |
| `/api/chat` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/chat/history/:param` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/chat/session` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/code/debug-tutor` | SERVER | OK | server | src/app/api/code/debug-tutor/route.ts | /api/code/debug-tutor/route.ts | 1/2 |
| `/api/code/evaluate` | SERVER | OK | server | src/app/api/code/evaluate/route.ts | /api/code/evaluate/route.ts | 1/2 |
| `/api/code/run-java` | SERVER | OK | server | src/app/api/code/run-java/route.ts | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | SERVER | OK | server | src/app/api/code/run-python/route.ts | /api/code/run-python/route.ts | 1/2 |
| `/api/codewars/matches` | SERVER | OK | server | src/app/api/codewars/matches/route.ts | /api/codewars/matches/route.ts | 2/4 |
| `/api/communication/all` | SERVER | OK | server | src/app/api/communication/all/route.ts | /api/communication/all/route.ts | 0/1 |
| `/api/communication/evaluate` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/consultant/analytics` | SERVER | OK | server | src/app/api/consultant/analytics/route.ts | /api/consultant/analytics/route.ts | 0/1 |
| `/api/consultant/pipeline` | SERVER | OK | server | src/app/api/consultant/pipeline/route.ts | /api/consultant/pipeline/route.ts | 0/1 |
| `/api/consultant/sessions` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/consultant/student/:param` | SERVER | OK | server | src/app/api/consultant/student/[id]/route.ts | /api/consultant/student/[id]/route.ts | 2/4 |
| `/api/consultant/student/:param/task` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/consultant/student/:param/verify-document` | SERVER | OK | server | src/app/api/consultant/student/[id]/verify-document/route.ts | /api/consultant/student/[id]/verify-document/route.ts | 1/2 |
| `/api/consultant/student/add` | SERVER | OK | server | src/app/api/consultant/student/add/route.ts | /api/consultant/student/add/route.ts | 1/2 |
| `/api/contact` | SERVER | OK | server | src/app/api/contact/route.ts | /api/contact/route.ts | 2/4 |
| `/api/documents/mine` | SERVER | OK | server | src/app/api/documents/mine/route.ts | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | SERVER | OK | server | src/app/api/documents/request/route.ts | /api/documents/request/route.ts | 0/1 |
| `/api/events/rsvp` | SERVER | OK | server | src/app/api/events/rsvp/route.ts | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | SERVER | OK | server | src/app/api/events/stats/route.ts | /api/events/stats/route.ts | 0/1 |
| `/api/exam/:param/questions` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exam/available` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exam/results` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/exam/scheduled` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exam/sync-result` | SERVER | OK | server | src/app/api/exam/sync-result/route.ts | /api/exam/sync-result/route.ts | 1/2 |
| `/api/exams/admin-manage` | SERVER | OK | server | src/app/api/exams/admin-manage/route.ts | /api/exams/admin-manage/route.ts | 3/5 |
| `/api/exams/get-exam` | SERVER | OK | server | src/app/api/exams/get-exam/route.ts | /api/exams/get-exam/route.ts | 1/1 |
| `/api/exams/results` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exams/schedule` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/exams/student-results` | SERVER | OK | server | src/app/api/exams/student-results/route.ts | /api/exams/student-results/route.ts | 1/2 |
| `/api/exams/student-schedule` | SERVER | OK | server | src/app/api/exams/student-schedule/route.ts | /api/exams/student-schedule/route.ts | 0/1 |
| `/api/finance/apply-scholarship` | SERVER | OK | server | src/app/api/finance/apply-scholarship/route.ts | /api/finance/apply-scholarship/route.ts | 0/1 |
| `/api/finance/dues` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/finance/pay-due` | SERVER | OK | server | src/app/api/finance/pay-due/route.ts | /api/finance/pay-due/route.ts | 0/1 |
| `/api/finance/scholarships` | SERVER | OK | server | src/app/api/finance/scholarships/route.ts | /api/finance/scholarships/route.ts | 0/1 |
| `/api/finance/student-dues` | SERVER | OK | server | src/app/api/finance/student-dues/route.ts | /api/finance/student-dues/route.ts | 1/2 |
| `/api/friends` | SERVER | OK | server | src/app/api/friends/route.ts | /api/friends/route.ts | 8/15 |
| `/api/friends/:param` | SERVER | OK | server | src/app/api/friends/[id]/route.ts | /api/friends/[id]/route.ts | 1/1 |
| `/api/friends/challenges` | SERVER | OK | server | src/app/api/friends/challenges/route.ts | /api/friends/challenges/route.ts | 4/8 |
| `/api/friends/messages` | SERVER | OK | server | src/app/api/friends/messages/route.ts | /api/friends/messages/route.ts | 3/5 |
| `/api/friends/privacy` | SERVER | OK | server | src/app/api/friends/privacy/route.ts | /api/friends/privacy/route.ts | 5/10 |
| `/api/friends/projects` | SERVER | OK | server | src/app/api/friends/projects/route.ts | /api/friends/projects/route.ts | 3/6 |
| `/api/friends/report` | SERVER | OK | server | src/app/api/friends/report/route.ts | /api/friends/report/route.ts | 1/2 |
| `/api/gd/history` | SERVER | OK | server | src/app/api/gd/history/route.ts | /api/gd/history/route.ts | 3/5 |
| `/api/github/ingest` | SERVER | OK | server | src/app/api/github/ingest/route.ts | /api/github/ingest/route.ts | 2/4 |
| `/api/grievances/stats` | SERVER | OK | server | src/app/api/grievances/stats/route.ts | /api/grievances/stats/route.ts | 0/1 |
| `/api/grievances/submit` | SERVER | OK | server | src/app/api/grievances/submit/route.ts | /api/grievances/submit/route.ts | 0/1 |
| `/api/group-discussion/bot-reply` | SERVER | OK | server | src/app/api/group-discussion/bot-reply/route.ts | /api/group-discussion/bot-reply/route.ts | 2/4 |
| `/api/group-discussion/evaluate` | SERVER | OK | server | src/app/api/group-discussion/evaluate/route.ts | /api/group-discussion/evaluate/route.ts | 1/2 |
| `/api/hostel/checkout-visitor` | SERVER | OK | server | src/app/api/hostel/checkout-visitor/route.ts | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | SERVER | OK | server | src/app/api/hostel/log-attendance/route.ts | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | SERVER | OK | server | src/app/api/hostel/raise-complaint/route.ts | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | SERVER | OK | server | src/app/api/hostel/register-visitor/route.ts | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | SERVER | OK | server | src/app/api/hostel/request-room/route.ts | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | SERVER | OK | server | src/app/api/hostel/stats/route.ts | /api/hostel/stats/route.ts | 0/1 |
| `/api/internships` | SERVER | OK | server | src/app/api/internships/route.ts | /api/internships/route.ts | 0/3 |
| `/api/interview/assist` | SERVER | OK | server | src/app/api/interview/assist/route.ts | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | SERVER | OK | server | src/app/api/interview/chat/route.ts | /api/interview/chat/route.ts | 3/6 |
| `/api/interview/evaluate` | SERVER | OK | server | src/app/api/interview/evaluate/route.ts | /api/interview/evaluate/route.ts | 2/4 |
| `/api/interview/generate-problem` | SERVER | OK | server | src/app/api/interview/generate-problem/route.ts | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | SERVER | OK | server | src/app/api/interview/history/route.ts | /api/interview/history/route.ts | 2/4 |
| `/api/interview/start` | SERVER | OK | server | src/app/api/interview/start/route.ts | /api/interview/start/route.ts | 3/6 |
| `/api/leaderboard` | SERVER | OK | server | src/app/api/leaderboard/route.ts | /api/leaderboard/route.ts | 1/1 |
| `/api/library/books` | SERVER | OK | server | src/app/api/library/books/route.ts | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | SERVER | OK | server | src/app/api/library/borrow/route.ts | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | SERVER | OK | server | src/app/api/library/reserve/route.ts | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | SERVER | OK | server | src/app/api/library/return/route.ts | /api/library/return/route.ts | 0/1 |
| `/api/llm` | SERVER | OK | server | src/app/api/llm/route.ts | /api/llm/route.ts | 2/4 |
| `/api/maintenance/report` | SERVER | OK | server | src/app/api/maintenance/report/route.ts | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | SERVER | OK | server | src/app/api/maintenance/stats/route.ts | /api/maintenance/stats/route.ts | 0/1 |
| `/api/mentor/chat` | SERVER | OK | server | src/app/api/mentor/chat/route.ts | /api/mentor/chat/route.ts | 1/2 |
| `/api/messages/direct` | SERVER | OK | server | src/app/api/messages/direct/route.ts | /api/messages/direct/route.ts | 1/2 |
| `/api/missions/generate-custom-skill` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/missions/history` | SERVER | OK | server | src/app/api/missions/history/route.ts | /api/missions/history/route.ts | 0/1 |
| `/api/missions/roleplay` | SERVER | OK | server | src/app/api/missions/roleplay/route.ts | /api/missions/roleplay/route.ts | 3/6 |
| `/api/missions/streak` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/missions/submit` | SERVER | OK | server | src/app/api/missions/submit/route.ts | /api/missions/submit/route.ts | 2/4 |
| `/api/missions/today` | SERVER | OK | server | src/app/api/missions/today/route.ts | /api/missions/today/route.ts | 0/2 |
| `/api/news` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/notes` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/notes/upload` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/notifications` | SERVER | OK | server | src/app/api/notifications/route.ts | /api/notifications/route.ts | 0/2 |
| `/api/notifications/:param/read` | SERVER | OK | server | src/app/api/notifications/[id]/read/route.ts | /api/notifications/[id]/read/route.ts | 1/2 |
| `/api/notifications/mark-all-read` | SERVER | OK | server | src/app/api/notifications/mark-all-read/route.ts | /api/notifications/mark-all-read/route.ts | 1/2 |
| `/api/opportunities` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/opportunities/applications` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/opportunities/apply` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/opportunities/feed` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/opportunities/match` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/parent/link-student` | SERVER | OK | server | src/app/api/parent/link-student/route.ts | /api/parent/link-student/route.ts | 1/2 |
| `/api/parent/student/:param/overview` | SERVER | OK | server | src/app/api/parent/student/[id]/overview/route.ts | /api/parent/student/[id]/overview/route.ts | 0/1 |
| `/api/parent/students` | SERVER | OK | server | src/app/api/parent/students/route.ts | /api/parent/students/route.ts | 0/2 |
| `/api/pathway/evidence` | SERVER | OK | server | src/app/api/pathway/evidence/route.ts | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment/create-order` | SERVER | OK | server | src/app/api/payment/create-order/route.ts | /api/payment/create-order/route.ts | 0/7 |
| `/api/payment/status` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/payment/verify` | SERVER | OK | server | src/app/api/payment/verify/route.ts | /api/payment/verify/route.ts | 1/9 |
| `/api/personality/analyze` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/personality/report` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/personality/session` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/pins/balance` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/pins/buy-ai-minutes` | SERVER | OK | server | src/app/api/pins/buy-ai-minutes/route.ts | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-bonus` | SERVER | OK | server | src/app/api/pins/claim-bonus/route.ts | /api/pins/claim-bonus/route.ts | 0/1 |
| `/api/pins/claim-streak-bonus` | SERVER | OK | server | src/app/api/pins/claim-streak-bonus/route.ts | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/earn` | SERVER | OK | server | src/app/api/pins/earn/route.ts | /api/pins/earn/route.ts | 2/4 |
| `/api/pins/extend-grace` | SERVER | OK | server | src/app/api/pins/extend-grace/route.ts | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/pins/spend` | SERVER | OK | server | src/app/api/pins/spend/route.ts | /api/pins/spend/route.ts | 1/2 |
| `/api/portfolio/analyze-certificate` | SERVER | OK | server | src/app/api/portfolio/analyze-certificate/route.ts | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-endorsement` | SERVER | OK | server | src/app/api/portfolio/verify-endorsement/route.ts | /api/portfolio/verify-endorsement/route.ts | 2/4 |
| `/api/portfolio/verify-exam` | SERVER | OK | server | src/app/api/portfolio/verify-exam/route.ts | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | SERVER | OK | server | src/app/api/projects/generate/route.ts | /api/projects/generate/route.ts | 1/2 |
| `/api/projects/xp` | SERVER | OK | server | src/app/api/projects/xp/route.ts | /api/projects/xp/route.ts | 0/1 |
| `/api/quest/complete` | SERVER | OK | server | src/app/api/quest/complete/route.ts | /api/quest/complete/route.ts | 3/6 |
| `/api/quests/capstone` | SERVER | OK | server | src/app/api/quests/capstone/route.ts | /api/quests/capstone/route.ts | 1/3 |
| `/api/quests/enrollment` | SERVER | OK | server | src/app/api/quests/enrollment/route.ts | /api/quests/enrollment/route.ts | 0/3 |
| `/api/quests/roadmap/generate` | SERVER | OK | server | src/app/api/quests/roadmap/generate/route.ts | /api/quests/roadmap/generate/route.ts | 1/2 |
| `/api/quests/verify` | SERVER | OK | server | src/app/api/quests/verify/route.ts | /api/quests/verify/route.ts | 0/1 |
| `/api/recruiter/activity-log` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/recruiter/analytics` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/applications` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/recruiter/candidate/:param` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/candidates` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/recruiter/company` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/recruiter/contact-request` | SERVER | OK | server | src/app/api/recruiter/contact-request/route.ts | /api/recruiter/contact-request/route.ts | 1/2 |
| `/api/recruiter/jobs` | UNHANDLED-404 | A | none | no route under src/app/api | — | 2/5 |
| `/api/recruiter/jobs/:param` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/recruiter/pipeline` | SERVER | OK | server | src/app/api/recruiter/pipeline/route.ts | /api/recruiter/pipeline/route.ts | 0/1 |
| `/api/recruiter/schedule-interview` | SERVER | OK | server | src/app/api/recruiter/schedule-interview/route.ts | /api/recruiter/schedule-interview/route.ts | 3/6 |
| `/api/recruiter/shortlist` | SERVER | OK | server | src/app/api/recruiter/shortlist/route.ts | /api/recruiter/shortlist/route.ts | 1/2 |
| `/api/recruiter/visibility` | SERVER | OK | server | src/app/api/recruiter/visibility/route.ts | /api/recruiter/visibility/route.ts | 2/4 |
| `/api/research/publish-paper` | SERVER | OK | server | src/app/api/research/publish-paper/route.ts | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | SERVER | OK | server | src/app/api/research/stats/route.ts | /api/research/stats/route.ts | 0/1 |
| `/api/resume/:param/improve` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/generate-from-vault` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/resume/list` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/structured` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/structured/:param/enhance` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/structured/me` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/suggestions` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/resume/upload` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/services/apply-leave` | SERVER | OK | server | src/app/api/services/apply-leave/route.ts | /api/services/apply-leave/route.ts | 2/4 |
| `/api/services/book-appointment` | SERVER | OK | server | src/app/api/services/book-appointment/route.ts | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | SERVER | OK | server | src/app/api/services/book-counselling/route.ts | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | SERVER | OK | server | src/app/api/services/file-request/route.ts | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | SERVER | OK | server | src/app/api/services/stats/route.ts | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/migration/execute` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/migration/validate` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/settings/rollout/feedback` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/stt` | SERVER | OK | server | src/app/api/stt/route.ts | /api/stt/route.ts | 2/4 |
| `/api/student/activity` | SERVER | OK | server | src/app/api/student/activity/route.ts | /api/student/activity/route.ts | 5/11 |
| `/api/study/complete` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/teacher/students` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/2 |
| `/api/teacher/submit-marks` | SERVER | OK | server | src/app/api/teacher/submit-marks/route.ts | /api/teacher/submit-marks/route.ts | 1/2 |
| `/api/teacher/training/submit` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/time` | SERVER | OK | server | src/app/api/time/route.ts | /api/time/route.ts | 1/2 |
| `/api/transport/register` | SERVER | OK | server | src/app/api/transport/register/route.ts | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | SERVER | OK | server | src/app/api/transport/stats/route.ts | /api/transport/stats/route.ts | 0/1 |
| `/api/trust/evaluate` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/2 |
| `/api/trust/score` | UNHANDLED-404 | A | none | no route under src/app/api | — | 0/1 |
| `/api/tts` | SERVER | OK | server | src/app/api/tts/route.ts | /api/tts/route.ts | 3/6 |
| `/api/university/dashboard` | SERVER | OK | server | src/app/api/university/dashboard/route.ts | /api/university/dashboard/route.ts | 0/1 |
| `/api/university/employability-report` | SERVER | OK | server | src/app/api/university/employability-report/route.ts | /api/university/employability-report/route.ts | 0/1 |
| `/api/university/placement-roster` | SERVER | OK | server | src/app/api/university/placement-roster/route.ts | /api/university/placement-roster/route.ts | 1/1 |
| `/api/university/skill-gaps` | SERVER | OK | server | src/app/api/university/skill-gaps/route.ts | /api/university/skill-gaps/route.ts | 0/1 |
| `/api/vault` | UNHANDLED-404 | A | none | no route under src/app/api | — | 1/3 |
| `/api/vault/delete` | SERVER | OK | server | src/app/api/vault/delete/route.ts | /api/vault/delete/route.ts | 2/4 |
| `/api/vault/upload` | SERVER | OK | server | src/app/api/vault/upload/route.ts | /api/vault/upload/route.ts | 0/5 |
| `/api/verify/:param` | SERVER | OK | server | src/app/api/verify/[credentialId]/route.ts | /api/verify/[credentialId]/route.ts | 1/1 |
| `/api/xp/add` | SERVER | OK | server | src/app/api/xp/add/route.ts | /api/xp/add/route.ts | 0/1 |
