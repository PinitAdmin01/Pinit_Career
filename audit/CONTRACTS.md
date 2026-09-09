# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-09T22:16:42.098Z
- **appCodeFiles**: 364
- **verticals**: 57
- **verticalsWithDefects**: 14
- **clientCalledPaths**: 174
- **reachablePaths**: 138
- **brokenOnEveryMethod**: 13
- **brokenOnSomeMethods**: 8
- **defectsInDeadCode**: 23
- **unbuiltPages**: 15
- **reachableSourceFiles**: 351
- **guardBranches**: 173
- **unreachableOrDynamicGuards**: 82
- **campusSwitchCases**: 102
- **campusPrefixes**: 19
- **deadRouteFiles**: 122
- **interceptorBypasses**: ["/api/tts"]
- **preferLivePrefixes**: 35
- **needsManualCheck**: 0
- **byWorst**: {"REAL":116,"COMPUTE":2,"THROWS":3,"STUB":28,"UNHANDLED-404":10,"EXTERNAL":5,"CAMPUS-404":2,"DECLINED":4,"BYPASSES-SHIM":1,"LOCAL-STORE":3}
- **byBucket**: {"OK":116,"C":7,"B":14,"A":37}
- **byLayer**: {"firestoreRouter":114,"campusFallback":49,"none":10,"interceptor-bypass":1}
- **guardsByVerdict**: {"REAL":111,"LOCAL-STORE":5,"STUB":40,"THROWS":9,"EXTERNAL":8}

**Verdict** — `REAL` reaches a datastore · `STUB` returns a literal · `THROWS` raises ApiError
· `EXTERNAL` calls out over the network · `COMPUTE` local computation only
· `UNHANDLED-404` no guard matches · `CAMPUS-404` campus switch has no case, default throws
· `BYPASSES-SHIM` interceptor exempts it, so the Firebase `**` rewrite answers with index.html.

**Bucket** — `A` port to client · `B` needs a trusted server · `C` genuinely stateless · `OK` already real.

## Broken no matter how they are called (13)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:720 | — | 0/2 |
| `/api/code/run-java` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/code/run-python/route.ts | 1/2 |
| `/api/gd/history` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/gd/history/route.ts | 3/5 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1280 | /api/payment/create-order/route.ts | 0/3 |
| `/api/portfolio/analyze-certificate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-exam` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/projects/generate/route.ts | 1/2 |
| `/api/stt` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/stt/route.ts | 2/4 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |

## Broken only on some methods (8)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.

- `/api/avatar/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/evaluate` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/opportunities` — broken on POST, PUT, PATCH, DELETE; works on GET
- `/api/resume/upload` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault` — broken on PUT, PATCH, DELETE; works on GET, POST
- `/api/vault/delete` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault/upload` — broken on GET, PUT, PATCH, DELETE; works on POST

## All paths (174)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin/audit-log` | REAL | OK | firestoreRouter | client.ts:2187 | /api/admin/audit-log/route.ts | 0/1 |
| `/api/admin/audit-log/add` | REAL | OK | firestoreRouter | client.ts:2187 | — | 5/10 |
| `/api/admin/users` | REAL | OK | firestoreRouter | client.ts:2187 | /api/admin/users/route.ts | 1/2 |
| `/api/admin/users/:param` | REAL | OK | firestoreRouter | client.ts:2187 | — | 1/2 |
| `/api/admin/users/:param/role` | REAL | OK | firestoreRouter | client.ts:2187 | — | 1/2 |
| `/api/admissions/apply` | REAL | OK | campusFallback | campusFallback.ts:158 | — | 1/2 |
| `/api/advisor/admin/alert` | REAL | OK | campusFallback | campusFallback.ts:247 | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | REAL | OK | campusFallback | campusFallback.ts:245 | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | REAL | OK | campusFallback | campusFallback.ts:241 | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | REAL | OK | campusFallback | campusFallback.ts:243 | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/alumni/donate` | COMPUTE | C | campusFallback | campusFallback.ts:300 | — | 0/1 |
| `/api/alumni/mentorship-request` | REAL | OK | campusFallback | campusFallback.ts:296 | — | 0/1 |
| `/api/alumni/referral-request` | REAL | OK | campusFallback | campusFallback.ts:298 | — | 0/1 |
| `/api/alumni/stats` | REAL | OK | campusFallback | campusFallback.ts:282 | /api/alumni/stats/route.ts | 0/1 |
| `/api/analytics/dashboard` | REAL | OK | firestoreRouter | client.ts:1214 | — | 0/3 |
| `/api/attendance/identify` | THROWS | B | firestoreRouter | client.ts:3210 | — | 0/1 |
| `/api/attention-span/analytics` | REAL | OK | firestoreRouter | client.ts:1989 | /api/attention-span/analytics/route.ts | 2/3 |
| `/api/attention-span/leaderboard` | REAL | OK | firestoreRouter | client.ts:1989 | /api/attention-span/leaderboard/route.ts | 1/2 |
| `/api/auth/face/enroll` | REAL | OK | firestoreRouter | client.ts:515 | /api/auth/face/enroll/route.ts | 2/4 |
| `/api/auth/face/enrolled` | REAL | OK | firestoreRouter | client.ts:511 | — | 1/2 |
| `/api/auth/face/verify` | REAL | OK | firestoreRouter | client.ts:519 | /api/auth/face/verify/route.ts | 1/2 |
| `/api/auth/me` | REAL | OK | firestoreRouter | client.ts:437 | — | 0/4 |
| `/api/auth/onboarding` | REAL | OK | firestoreRouter | client.ts:451 | — | 18/36 |
| `/api/auth/profile` | REAL | OK | firestoreRouter | client.ts:439 | — | 19/38 |
| `/api/auth/teacher` | REAL | OK | firestoreRouter | client.ts:450 | — | 1/2 |
| `/api/avatar/chat` | STUB | A | firestoreRouter | client.ts:3167 | — | 2/5 |
| `/api/avatar/context` | REAL | OK | firestoreRouter | client.ts:2708 | — | 2/4 |
| `/api/avatar/memory` | REAL | OK | firestoreRouter | client.ts:2715 | — | 2/4 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-builder/generate` | REAL | OK | firestoreRouter | client.ts:742 | — | 0/2 |
| `/api/career-dna/profile` | REAL | OK | firestoreRouter | client.ts:716 | — | 0/1 |
| `/api/career-dna/scores` | REAL | OK | firestoreRouter | client.ts:715 | — | 0/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:720 | — | 0/2 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:721 | — | 1/2 |
| `/api/chat` | STUB | A | firestoreRouter | client.ts:1647 | — | 1/2 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:1646 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:1645 | — | 1/2 |
| `/api/code/run-java` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/code/run-python/route.ts | 1/2 |
| `/api/communication/all` | REAL | OK | campusFallback | campusFallback.ts:217 | — | 0/1 |
| `/api/communication/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:569 | — | 0/1 |
| `/api/consultant/analytics` | REAL | OK | firestoreRouter | client.ts:2041 | — | 0/1 |
| `/api/consultant/pipeline` | REAL | OK | firestoreRouter | client.ts:2041 | — | 0/1 |
| `/api/consultant/sessions` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/3 |
| `/api/consultant/student/:param` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/2 |
| `/api/consultant/student/:param/task` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/2 |
| `/api/consultant/student/:param/task/:param` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/1 |
| `/api/consultant/student/:param/verify-document` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/2 |
| `/api/consultant/student/add` | REAL | OK | firestoreRouter | client.ts:2041 | — | 1/2 |
| `/api/documents/mine` | REAL | OK | campusFallback | campusFallback.ts:120 | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | REAL | OK | campusFallback | campusFallback.ts:122 | — | 0/1 |
| `/api/events/rsvp` | REAL | OK | campusFallback | campusFallback.ts:263 | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | REAL | OK | campusFallback | campusFallback.ts:261 | /api/events/stats/route.ts | 0/1 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:1481 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:1480 | — | 0/1 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:1483 | — | 0/2 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:1484 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:1482 | — | 1/2 |
| `/api/exams/student-results` | REAL | OK | campusFallback | campusFallback.ts:97 | /api/exams/student-results/route.ts | 1/2 |
| `/api/exams/student-schedule` | REAL | OK | campusFallback | campusFallback.ts:95 | /api/exams/student-schedule/route.ts | 0/1 |
| `/api/finance/apply-scholarship` | REAL | OK | campusFallback | campusFallback.ts:79 | /api/finance/apply-scholarship/route.ts | 0/1 |
| `/api/finance/pay-due` | REAL | OK | campusFallback | campusFallback.ts:75 | /api/finance/pay-due/route.ts | 0/1 |
| `/api/finance/scholarships` | COMPUTE | C | campusFallback | campusFallback.ts:77 | /api/finance/scholarships/route.ts | 0/1 |
| `/api/finance/student-dues` | REAL | OK | campusFallback | campusFallback.ts:73 | /api/finance/student-dues/route.ts | 1/2 |
| `/api/gd/history` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/gd/history/route.ts | 3/5 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/grievances/stats` | REAL | OK | campusFallback | campusFallback.ts:250 | /api/grievances/stats/route.ts | 0/1 |
| `/api/grievances/submit` | REAL | OK | campusFallback | campusFallback.ts:252 | /api/grievances/submit/route.ts | 0/1 |
| `/api/group-discussion/bot-reply` | EXTERNAL | C | firestoreRouter | client.ts:1666 | /api/group-discussion/bot-reply/route.ts | 2/4 |
| `/api/group-discussion/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:1693 | /api/group-discussion/evaluate/route.ts | 1/2 |
| `/api/hostel/checkout-visitor` | REAL | OK | campusFallback | campusFallback.ts:68 | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | REAL | OK | campusFallback | campusFallback.ts:60 | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | REAL | OK | campusFallback | campusFallback.ts:62 | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | REAL | OK | campusFallback | campusFallback.ts:66 | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | REAL | OK | campusFallback | campusFallback.ts:58 | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | REAL | OK | campusFallback | campusFallback.ts:56 | /api/hostel/stats/route.ts | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/chat/route.ts | 1/2 |
| `/api/interview/evaluate` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/evaluate/route.ts | 2/4 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1471 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | REAL | OK | firestoreRouter | client.ts:1458 | /api/interview/history/route.ts | 2/4 |
| `/api/library/books` | REAL | OK | campusFallback | campusFallback.ts:84 | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | REAL | OK | campusFallback | campusFallback.ts:86 | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | REAL | OK | campusFallback | campusFallback.ts:90 | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | REAL | OK | campusFallback | campusFallback.ts:88 | /api/library/return/route.ts | 0/1 |
| `/api/llm` | EXTERNAL | C | firestoreRouter | client.ts:3168 | /api/llm/route.ts | 1/2 |
| `/api/maintenance/report` | REAL | OK | campusFallback | campusFallback.ts:208 | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | REAL | OK | campusFallback | campusFallback.ts:206 | /api/maintenance/stats/route.ts | 0/1 |
| `/api/messages/direct` | REAL | OK | firestoreRouter | client.ts:2427 | — | 1/2 |
| `/api/missions/generate-custom-skill` | REAL | OK | firestoreRouter | client.ts:564 | — | 1/2 |
| `/api/missions/history` | REAL | OK | firestoreRouter | client.ts:548 | — | 0/1 |
| `/api/missions/roleplay` | EXTERNAL | C | firestoreRouter | client.ts:688 | /api/missions/roleplay/route.ts | 3/6 |
| `/api/missions/streak` | REAL | OK | firestoreRouter | client.ts:714 | — | 0/1 |
| `/api/missions/submit` | REAL | OK | firestoreRouter | client.ts:549 | — | 2/4 |
| `/api/missions/today` | REAL | OK | firestoreRouter | client.ts:547 | — | 0/2 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications` | REAL | OK | firestoreRouter | client.ts:1192 | — | 0/1 |
| `/api/notifications/:param/read` | REAL | OK | firestoreRouter | client.ts:1194 | — | 1/2 |
| `/api/notifications/mark-all-read` | REAL | OK | firestoreRouter | client.ts:1193 | — | 1/2 |
| `/api/opportunities` | STUB | A | firestoreRouter | client.ts:1200 | — | 0/2 |
| `/api/opportunities/applications` | REAL | OK | firestoreRouter | client.ts:1212 | — | 0/1 |
| `/api/opportunities/apply` | REAL | OK | firestoreRouter | client.ts:1205 | — | 1/2 |
| `/api/opportunities/feed` | REAL | OK | firestoreRouter | client.ts:1200 | — | 0/1 |
| `/api/opportunities/match` | REAL | OK | firestoreRouter | client.ts:1206 | — | 0/1 |
| `/api/parent/link-student` | REAL | OK | firestoreRouter | client.ts:1778 | — | 1/2 |
| `/api/parent/student/:param/overview` | REAL | OK | firestoreRouter | client.ts:1745 | — | 0/1 |
| `/api/parent/students` | REAL | OK | firestoreRouter | client.ts:1778 | — | 0/2 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1280 | /api/payment/create-order/route.ts | 0/3 |
| `/api/payment/status` | REAL | OK | firestoreRouter | client.ts:1252 | — | 0/1 |
| `/api/payment/verify` | THROWS | B | firestoreRouter | client.ts:1284 | /api/payment/verify/route.ts | 1/2 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:1478 | — | 0/1 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:1476 | — | 0/2 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:1477 | — | 0/1 |
| `/api/pins/balance` | REAL | OK | firestoreRouter | client.ts:1219 | — | 0/1 |
| `/api/pins/earn` | REAL | OK | firestoreRouter | client.ts:1223 | — | 2/4 |
| `/api/pins/spend` | REAL | OK | firestoreRouter | client.ts:1235 | — | 3/6 |
| `/api/portfolio/analyze-certificate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-endorsement` | REAL | OK | firestoreRouter | client.ts:2005 | /api/portfolio/verify-endorsement/route.ts | 2/4 |
| `/api/portfolio/verify-exam` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/projects/generate/route.ts | 1/2 |
| `/api/quests/verify` | REAL | OK | firestoreRouter | client.ts:2527 | — | 0/1 |
| `/api/recruiter/activity-log` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/2 |
| `/api/recruiter/analytics` | REAL | OK | firestoreRouter | client.ts:1851 | — | 0/1 |
| `/api/recruiter/applications` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/3 |
| `/api/recruiter/candidate/:param` | REAL | OK | firestoreRouter | client.ts:1851 | — | 0/1 |
| `/api/recruiter/candidates` | REAL | OK | firestoreRouter | client.ts:1851 | — | 0/1 |
| `/api/recruiter/company` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/3 |
| `/api/recruiter/contact-request` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/2 |
| `/api/recruiter/jobs` | REAL | OK | firestoreRouter | client.ts:1851 | — | 2/5 |
| `/api/recruiter/jobs/:param` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/2 |
| `/api/recruiter/pipeline` | REAL | OK | firestoreRouter | client.ts:1851 | — | 0/1 |
| `/api/recruiter/schedule-interview` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/2 |
| `/api/recruiter/shortlist` | REAL | OK | firestoreRouter | client.ts:1851 | — | 1/2 |
| `/api/recruiter/visibility` | REAL | OK | firestoreRouter | client.ts:1986 | — | 1/2 |
| `/api/research/publish-paper` | REAL | OK | campusFallback | campusFallback.ts:273 | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | REAL | OK | campusFallback | campusFallback.ts:271 | /api/research/stats/route.ts | 0/1 |
| `/api/resume/:param/improve` | STUB | A | firestoreRouter | client.ts:1185 | — | 0/1 |
| `/api/resume/generate-from-vault` | STUB | A | firestoreRouter | client.ts:1185 | — | 0/2 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1185 | — | 0/1 |
| `/api/resume/structured` | STUB | A | firestoreRouter | client.ts:1185 | — | 0/1 |
| `/api/resume/structured/:param/enhance` | REAL | OK | firestoreRouter | client.ts:1171 | — | 0/1 |
| `/api/resume/structured/me` | REAL | OK | firestoreRouter | client.ts:725 | — | 0/1 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1185 | — | 0/1 |
| `/api/resume/upload` | STUB | A | firestoreRouter | client.ts:1185 | — | 2/4 |
| `/api/services/apply-leave` | REAL | OK | campusFallback | campusFallback.ts:228 | /api/services/apply-leave/route.ts | 1/2 |
| `/api/services/book-appointment` | REAL | OK | campusFallback | campusFallback.ts:232 | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | REAL | OK | campusFallback | campusFallback.ts:234 | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | REAL | OK | campusFallback | campusFallback.ts:230 | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | REAL | OK | campusFallback | campusFallback.ts:226 | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/execute` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/validate` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/rollout/feedback` | DECLINED | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/stt` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/stt/route.ts | 2/4 |
| `/api/study/complete` | REAL | OK | firestoreRouter | client.ts:1743 | — | 1/2 |
| `/api/teacher/students` | REAL | OK | firestoreRouter | client.ts:2381 | — | 0/2 |
| `/api/teacher/training/submit` | REAL | OK | firestoreRouter | client.ts:2447 | — | 1/2 |
| `/api/transport/register` | REAL | OK | campusFallback | campusFallback.ts:106 | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | REAL | OK | campusFallback | campusFallback.ts:104 | /api/transport/stats/route.ts | 0/1 |
| `/api/trust/evaluate` | REAL | OK | firestoreRouter | client.ts:1474 | — | 1/2 |
| `/api/trust/score` | REAL | OK | firestoreRouter | client.ts:1473 | — | 0/1 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |
| `/api/university/dashboard` | REAL | OK | firestoreRouter | client.ts:2026 | — | 0/1 |
| `/api/university/employability-report` | REAL | OK | firestoreRouter | client.ts:2026 | — | 0/1 |
| `/api/university/skill-gaps` | REAL | OK | firestoreRouter | client.ts:2026 | — | 0/1 |
| `/api/v1/auth/exchange-session` | LOCAL-STORE | A | firestoreRouter | client.ts:319 | — | 1/2 |
| `/api/v1/auth/logout-all` | LOCAL-STORE | A | firestoreRouter | client.ts:413 | — | 1/2 |
| `/api/v1/auth/vault-approve` | LOCAL-STORE | A | firestoreRouter | client.ts:279 | — | 0/1 |
| `/api/v1/auth/vault-challenge` | REAL | OK | firestoreRouter | client.ts:165 | — | 0/1 |
| `/api/vault` | STUB | A | firestoreRouter | client.ts:1188 | — | 2/5 |
| `/api/vault/delete` | STUB | A | firestoreRouter | client.ts:1191 | /api/vault/delete/route.ts | 1/2 |
| `/api/vault/upload` | STUB | A | firestoreRouter | client.ts:1190 | /api/vault/upload/route.ts | 0/3 |
