# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-13T14:01:41.552Z
- **appCodeFiles**: 378
- **verticals**: 66
- **verticalsWithDefects**: 17
- **clientCalledPaths**: 190
- **reachablePaths**: 152
- **brokenOnEveryMethod**: 19
- **brokenOnSomeMethods**: 4
- **defectsInDeadCode**: 24
- **unbuiltPages**: 15
- **reachableSourceFiles**: 362
- **guardBranches**: 181
- **unreachableOrDynamicGuards**: 82
- **campusSwitchCases**: 102
- **campusPrefixes**: 19
- **deadRouteFiles**: 147
- **interceptorBypasses**: ["/api/tts"]
- **preferLivePrefixes**: 58
- **needsManualCheck**: 0
- **byWorst**: {"REAL":128,"COMPUTE":3,"THROWS":5,"STUB":24,"UNHANDLED-404":15,"EXTERNAL":5,"CAMPUS-404":2,"DECLINED":4,"BYPASSES-SHIM":1,"LOCAL-STORE":3}
- **byBucket**: {"OK":128,"C":8,"B":19,"A":35}
- **byLayer**: {"firestoreRouter":125,"campusFallback":49,"none":15,"interceptor-bypass":1}
- **guardsByVerdict**: {"REAL":120,"LOCAL-STORE":5,"STUB":38,"THROWS":9,"EXTERNAL":8,"COMPUTE":1}

**Verdict** — `REAL` reaches a datastore · `STUB` returns a literal · `THROWS` raises ApiError
· `EXTERNAL` calls out over the network · `COMPUTE` local computation only
· `UNHANDLED-404` no guard matches · `CAMPUS-404` campus switch has no case, default throws
· `BYPASSES-SHIM` interceptor exempts it, so the Firebase `**` rewrite answers with index.html.

**Bucket** — `A` port to client · `B` needs a trusted server · `C` genuinely stateless · `OK` already real.

## Broken no matter how they are called (19)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/auth/session` | THROWS | B | firestoreRouter | client.ts:562 | /api/auth/session/route.ts | 5/10 |
| `/api/auth/vault-exchange` | THROWS | B | firestoreRouter | client.ts:562 | /api/auth/vault-exchange/route.ts | 1/2 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:738 | /api/career-twin/results/route.ts | 0/3 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1757 | /api/payment/create-order/route.ts | 0/3 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 1/2 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |
| `/api/user/award-badge` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/user/award-badge/route.ts | 2/4 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |

## Broken only on some methods (4)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.

- `/api/avatar/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/evaluate` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/opportunities` — broken on POST, PUT, PATCH, DELETE; works on GET

## All paths (190)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin/audit-log` | REAL | OK | firestoreRouter | client.ts:3103 | /api/admin/audit-log/route.ts | 0/1 |
| `/api/admin/audit-log/add` | REAL | OK | firestoreRouter | client.ts:3103 | — | 5/10 |
| `/api/admin/users` | REAL | OK | firestoreRouter | client.ts:3103 | /api/admin/users/route.ts | 1/2 |
| `/api/admin/users/:param` | REAL | OK | firestoreRouter | client.ts:3103 | — | 1/2 |
| `/api/admin/users/:param/role` | REAL | OK | firestoreRouter | client.ts:3103 | — | 1/2 |
| `/api/admissions/apply` | REAL | OK | campusFallback | campusFallback.ts:158 | — | 1/2 |
| `/api/advisor/admin/alert` | REAL | OK | campusFallback | campusFallback.ts:247 | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | REAL | OK | campusFallback | campusFallback.ts:245 | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | REAL | OK | campusFallback | campusFallback.ts:241 | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | REAL | OK | campusFallback | campusFallback.ts:243 | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/alumni/donate` | COMPUTE | C | campusFallback | campusFallback.ts:300 | — | 0/1 |
| `/api/alumni/mentorship-request` | REAL | OK | campusFallback | campusFallback.ts:296 | — | 0/1 |
| `/api/alumni/referral-request` | REAL | OK | campusFallback | campusFallback.ts:298 | — | 0/1 |
| `/api/alumni/stats` | REAL | OK | campusFallback | campusFallback.ts:282 | /api/alumni/stats/route.ts | 0/1 |
| `/api/analytics/dashboard` | REAL | OK | firestoreRouter | client.ts:1454 | — | 0/3 |
| `/api/attendance/identify` | THROWS | B | firestoreRouter | client.ts:4146 | — | 0/1 |
| `/api/attention-span/analytics` | REAL | OK | firestoreRouter | client.ts:2709 | /api/attention-span/analytics/route.ts | 2/3 |
| `/api/attention-span/leaderboard` | REAL | OK | firestoreRouter | client.ts:2709 | /api/attention-span/leaderboard/route.ts | 1/2 |
| `/api/attention-span/progress` | REAL | OK | firestoreRouter | client.ts:2709 | /api/attention-span/progress/route.ts | 2/4 |
| `/api/auth/face/enroll` | REAL | OK | firestoreRouter | client.ts:548 | /api/auth/face/enroll/route.ts | 2/4 |
| `/api/auth/face/enrolled` | REAL | OK | firestoreRouter | client.ts:544 | — | 1/2 |
| `/api/auth/face/verify` | REAL | OK | firestoreRouter | client.ts:552 | /api/auth/face/verify/route.ts | 1/2 |
| `/api/auth/me` | REAL | OK | firestoreRouter | client.ts:438 | — | 0/4 |
| `/api/auth/onboarding` | REAL | OK | firestoreRouter | client.ts:452 | — | 15/30 |
| `/api/auth/profile` | REAL | OK | firestoreRouter | client.ts:440 | — | 19/38 |
| `/api/auth/session` | THROWS | B | firestoreRouter | client.ts:562 | /api/auth/session/route.ts | 5/10 |
| `/api/auth/teacher` | REAL | OK | firestoreRouter | client.ts:451 | — | 1/2 |
| `/api/auth/vault-exchange` | THROWS | B | firestoreRouter | client.ts:562 | /api/auth/vault-exchange/route.ts | 1/2 |
| `/api/avatar/chat` | STUB | B | firestoreRouter | client.ts:4089 | /api/avatar/chat/route.ts | 2/5 |
| `/api/avatar/context` | REAL | OK | firestoreRouter | client.ts:3630 | — | 2/4 |
| `/api/avatar/memory` | REAL | OK | firestoreRouter | client.ts:3637 | — | 2/4 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-builder/generate` | REAL | OK | firestoreRouter | client.ts:760 | — | 0/2 |
| `/api/career-dna/profile` | REAL | OK | firestoreRouter | client.ts:734 | — | 0/1 |
| `/api/career-dna/scores` | REAL | OK | firestoreRouter | client.ts:733 | — | 0/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:738 | /api/career-twin/results/route.ts | 0/3 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:739 | — | 1/2 |
| `/api/chat` | STUB | A | firestoreRouter | client.ts:2214 | — | 1/2 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:2213 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:2212 | — | 1/2 |
| `/api/code/evaluate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/evaluate/route.ts | 1/2 |
| `/api/code/run-java` | REAL | OK | firestoreRouter | client.ts:2060 | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | REAL | OK | firestoreRouter | client.ts:1993 | /api/code/run-python/route.ts | 1/2 |
| `/api/codewars/matches` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/codewars/matches/route.ts | 2/4 |
| `/api/communication/all` | REAL | OK | campusFallback | campusFallback.ts:217 | — | 0/1 |
| `/api/communication/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:587 | — | 0/1 |
| `/api/consultant/analytics` | REAL | OK | firestoreRouter | client.ts:2957 | — | 0/1 |
| `/api/consultant/pipeline` | REAL | OK | firestoreRouter | client.ts:2957 | — | 0/1 |
| `/api/consultant/sessions` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/3 |
| `/api/consultant/student/:param` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/2 |
| `/api/consultant/student/:param/task` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/2 |
| `/api/consultant/student/:param/task/:param` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/1 |
| `/api/consultant/student/:param/verify-document` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/2 |
| `/api/consultant/student/add` | REAL | OK | firestoreRouter | client.ts:2957 | — | 1/2 |
| `/api/documents/mine` | REAL | OK | campusFallback | campusFallback.ts:120 | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | REAL | OK | campusFallback | campusFallback.ts:122 | — | 0/1 |
| `/api/events/rsvp` | REAL | OK | campusFallback | campusFallback.ts:263 | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | REAL | OK | campusFallback | campusFallback.ts:261 | /api/events/stats/route.ts | 0/1 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:1958 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:1957 | — | 0/1 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:1960 | — | 0/2 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:1961 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:1959 | — | 1/2 |
| `/api/exams/student-results` | REAL | OK | campusFallback | campusFallback.ts:97 | /api/exams/student-results/route.ts | 1/2 |
| `/api/exams/student-schedule` | REAL | OK | campusFallback | campusFallback.ts:95 | /api/exams/student-schedule/route.ts | 0/1 |
| `/api/finance/apply-scholarship` | REAL | OK | campusFallback | campusFallback.ts:79 | /api/finance/apply-scholarship/route.ts | 0/1 |
| `/api/finance/pay-due` | REAL | OK | campusFallback | campusFallback.ts:75 | /api/finance/pay-due/route.ts | 0/1 |
| `/api/finance/scholarships` | COMPUTE | C | campusFallback | campusFallback.ts:77 | /api/finance/scholarships/route.ts | 0/1 |
| `/api/finance/student-dues` | REAL | OK | campusFallback | campusFallback.ts:73 | /api/finance/student-dues/route.ts | 1/2 |
| `/api/gd/history` | REAL | OK | firestoreRouter | client.ts:2216 | /api/gd/history/route.ts | 3/5 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/grievances/stats` | REAL | OK | campusFallback | campusFallback.ts:250 | /api/grievances/stats/route.ts | 0/1 |
| `/api/grievances/submit` | REAL | OK | campusFallback | campusFallback.ts:252 | /api/grievances/submit/route.ts | 0/1 |
| `/api/group-discussion/bot-reply` | EXTERNAL | C | firestoreRouter | client.ts:2386 | /api/group-discussion/bot-reply/route.ts | 2/4 |
| `/api/group-discussion/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:2413 | /api/group-discussion/evaluate/route.ts | 1/2 |
| `/api/hostel/checkout-visitor` | REAL | OK | campusFallback | campusFallback.ts:68 | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | REAL | OK | campusFallback | campusFallback.ts:60 | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | REAL | OK | campusFallback | campusFallback.ts:62 | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | REAL | OK | campusFallback | campusFallback.ts:66 | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | REAL | OK | campusFallback | campusFallback.ts:58 | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | REAL | OK | campusFallback | campusFallback.ts:56 | /api/hostel/stats/route.ts | 0/1 |
| `/api/internships` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/internships/route.ts | 2/4 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/chat/route.ts | 1/2 |
| `/api/interview/evaluate` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/evaluate/route.ts | 2/4 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1948 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | REAL | OK | firestoreRouter | client.ts:1935 | /api/interview/history/route.ts | 2/4 |
| `/api/leaderboard` | REAL | OK | firestoreRouter | client.ts:1376 | /api/leaderboard/route.ts | 1/2 |
| `/api/library/books` | REAL | OK | campusFallback | campusFallback.ts:84 | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | REAL | OK | campusFallback | campusFallback.ts:86 | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | REAL | OK | campusFallback | campusFallback.ts:90 | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | REAL | OK | campusFallback | campusFallback.ts:88 | /api/library/return/route.ts | 0/1 |
| `/api/llm` | EXTERNAL | C | firestoreRouter | client.ts:4104 | /api/llm/route.ts | 1/2 |
| `/api/maintenance/report` | REAL | OK | campusFallback | campusFallback.ts:208 | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | REAL | OK | campusFallback | campusFallback.ts:206 | /api/maintenance/stats/route.ts | 0/1 |
| `/api/mentor/chat` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/mentor/chat/route.ts | 1/2 |
| `/api/messages/direct` | REAL | OK | firestoreRouter | client.ts:3343 | — | 1/2 |
| `/api/missions/generate-custom-skill` | REAL | OK | firestoreRouter | client.ts:582 | — | 1/2 |
| `/api/missions/history` | REAL | OK | firestoreRouter | client.ts:566 | — | 0/1 |
| `/api/missions/roleplay` | EXTERNAL | C | firestoreRouter | client.ts:706 | /api/missions/roleplay/route.ts | 3/6 |
| `/api/missions/streak` | REAL | OK | firestoreRouter | client.ts:732 | — | 0/1 |
| `/api/missions/submit` | REAL | OK | firestoreRouter | client.ts:567 | /api/missions/submit/route.ts | 2/4 |
| `/api/missions/today` | REAL | OK | firestoreRouter | client.ts:565 | /api/missions/today/route.ts | 0/2 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications` | REAL | OK | firestoreRouter | client.ts:1354 | — | 0/1 |
| `/api/notifications/:param/read` | REAL | OK | firestoreRouter | client.ts:1356 | — | 1/2 |
| `/api/notifications/mark-all-read` | REAL | OK | firestoreRouter | client.ts:1355 | — | 1/2 |
| `/api/opportunities` | STUB | A | firestoreRouter | client.ts:1362 | — | 0/2 |
| `/api/opportunities/applications` | REAL | OK | firestoreRouter | client.ts:1374 | — | 0/1 |
| `/api/opportunities/apply` | REAL | OK | firestoreRouter | client.ts:1367 | — | 1/2 |
| `/api/opportunities/feed` | REAL | OK | firestoreRouter | client.ts:1362 | — | 0/1 |
| `/api/opportunities/match` | REAL | OK | firestoreRouter | client.ts:1368 | — | 0/1 |
| `/api/parent/link-student` | REAL | OK | firestoreRouter | client.ts:2498 | — | 1/2 |
| `/api/parent/student/:param/overview` | REAL | OK | firestoreRouter | client.ts:2465 | — | 0/1 |
| `/api/parent/students` | REAL | OK | firestoreRouter | client.ts:2498 | — | 0/2 |
| `/api/pathway/evidence` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pathway/evidence/route.ts | 1/2 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1757 | /api/payment/create-order/route.ts | 0/3 |
| `/api/payment/status` | REAL | OK | firestoreRouter | client.ts:1729 | — | 0/1 |
| `/api/payment/verify` | THROWS | B | firestoreRouter | client.ts:1761 | /api/payment/verify/route.ts | 1/2 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:1955 | — | 0/1 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:1953 | — | 0/2 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:1954 | — | 0/1 |
| `/api/pins/balance` | REAL | OK | firestoreRouter | client.ts:1696 | — | 0/1 |
| `/api/pins/buy-ai-minutes` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/buy-ai-minutes/route.ts | 1/2 |
| `/api/pins/claim-streak-bonus` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/claim-streak-bonus/route.ts | 1/2 |
| `/api/pins/earn` | REAL | OK | firestoreRouter | client.ts:1700 | — | 2/4 |
| `/api/pins/extend-grace` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/pins/extend-grace/route.ts | 1/2 |
| `/api/pins/spend` | REAL | OK | firestoreRouter | client.ts:1712 | — | 1/2 |
| `/api/portfolio/analyze-certificate` | REAL | OK | firestoreRouter | client.ts:2746 | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-endorsement` | REAL | OK | firestoreRouter | client.ts:2725 | /api/portfolio/verify-endorsement/route.ts | 2/4 |
| `/api/portfolio/verify-exam` | REAL | OK | firestoreRouter | client.ts:2882 | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | REAL | OK | firestoreRouter | client.ts:1459 | /api/projects/generate/route.ts | 1/2 |
| `/api/quest/complete` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/quest/complete/route.ts | 1/2 |
| `/api/quests/verify` | REAL | OK | firestoreRouter | client.ts:3449 | — | 0/1 |
| `/api/recruiter/activity-log` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/2 |
| `/api/recruiter/analytics` | REAL | OK | firestoreRouter | client.ts:2571 | — | 0/1 |
| `/api/recruiter/applications` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/3 |
| `/api/recruiter/candidate/:param` | REAL | OK | firestoreRouter | client.ts:2571 | — | 0/1 |
| `/api/recruiter/candidates` | REAL | OK | firestoreRouter | client.ts:2571 | — | 0/1 |
| `/api/recruiter/company` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/3 |
| `/api/recruiter/contact-request` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/2 |
| `/api/recruiter/jobs` | REAL | OK | firestoreRouter | client.ts:2571 | — | 2/5 |
| `/api/recruiter/jobs/:param` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/2 |
| `/api/recruiter/pipeline` | REAL | OK | firestoreRouter | client.ts:2571 | — | 0/1 |
| `/api/recruiter/schedule-interview` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/2 |
| `/api/recruiter/shortlist` | REAL | OK | firestoreRouter | client.ts:2571 | — | 1/2 |
| `/api/recruiter/visibility` | REAL | OK | firestoreRouter | client.ts:2706 | — | 1/2 |
| `/api/research/publish-paper` | REAL | OK | campusFallback | campusFallback.ts:273 | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | REAL | OK | campusFallback | campusFallback.ts:271 | /api/research/stats/route.ts | 0/1 |
| `/api/resume/:param/improve` | STUB | A | firestoreRouter | client.ts:1269 | — | 0/1 |
| `/api/resume/generate-from-vault` | STUB | A | firestoreRouter | client.ts:1269 | — | 0/2 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1269 | — | 0/1 |
| `/api/resume/structured` | STUB | A | firestoreRouter | client.ts:1269 | — | 0/1 |
| `/api/resume/structured/:param/enhance` | REAL | OK | firestoreRouter | client.ts:1224 | — | 0/1 |
| `/api/resume/structured/me` | REAL | OK | firestoreRouter | client.ts:743 | — | 0/1 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1269 | — | 0/1 |
| `/api/resume/upload` | REAL | OK | firestoreRouter | client.ts:860 | — | 2/4 |
| `/api/services/apply-leave` | REAL | OK | campusFallback | campusFallback.ts:228 | /api/services/apply-leave/route.ts | 1/2 |
| `/api/services/book-appointment` | REAL | OK | campusFallback | campusFallback.ts:232 | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | REAL | OK | campusFallback | campusFallback.ts:234 | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | REAL | OK | campusFallback | campusFallback.ts:230 | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | REAL | OK | campusFallback | campusFallback.ts:226 | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/execute` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/validate` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/rollout/feedback` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/stt` | COMPUTE | C | firestoreRouter | client.ts:3443 | /api/stt/route.ts | 2/4 |
| `/api/study/complete` | REAL | OK | firestoreRouter | client.ts:2463 | — | 1/2 |
| `/api/teacher/students` | REAL | OK | firestoreRouter | client.ts:3297 | — | 0/2 |
| `/api/teacher/training/submit` | REAL | OK | firestoreRouter | client.ts:3363 | — | 1/2 |
| `/api/time` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/time/route.ts | 1/2 |
| `/api/transport/register` | REAL | OK | campusFallback | campusFallback.ts:106 | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | REAL | OK | campusFallback | campusFallback.ts:104 | /api/transport/stats/route.ts | 0/1 |
| `/api/trust/evaluate` | REAL | OK | firestoreRouter | client.ts:1951 | — | 1/2 |
| `/api/trust/score` | REAL | OK | firestoreRouter | client.ts:1950 | — | 0/1 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |
| `/api/university/dashboard` | REAL | OK | firestoreRouter | client.ts:2942 | — | 0/1 |
| `/api/university/employability-report` | REAL | OK | firestoreRouter | client.ts:2942 | — | 0/1 |
| `/api/university/skill-gaps` | REAL | OK | firestoreRouter | client.ts:2942 | — | 0/1 |
| `/api/user/award-badge` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/user/award-badge/route.ts | 2/4 |
| `/api/v1/auth/exchange-session` | LOCAL-STORE | A | firestoreRouter | client.ts:320 | — | 1/2 |
| `/api/v1/auth/logout-all` | LOCAL-STORE | A | firestoreRouter | client.ts:414 | — | 1/2 |
| `/api/v1/auth/vault-approve` | LOCAL-STORE | A | firestoreRouter | client.ts:280 | — | 0/1 |
| `/api/v1/auth/vault-challenge` | REAL | OK | firestoreRouter | client.ts:166 | — | 0/1 |
| `/api/vault` | REAL | OK | firestoreRouter | client.ts:1282 | — | 2/5 |
| `/api/vault/delete` | REAL | OK | firestoreRouter | client.ts:1068 | /api/vault/delete/route.ts | 1/2 |
| `/api/vault/upload` | REAL | OK | firestoreRouter | client.ts:1284 | /api/vault/upload/route.ts | 0/3 |
| `/api/xp/add` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/xp/add/route.ts | 1/2 |
