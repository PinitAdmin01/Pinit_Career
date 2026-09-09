# Contract map — generated, do not hand-edit

Regenerate: `node audit/extract-contracts.mjs`

- **generated**: 2026-09-09T08:51:25.477Z
- **appCodeFiles**: 358
- **verticals**: 57
- **verticalsWithDefects**: 25
- **clientCalledPaths**: 174
- **brokenOnEveryMethod**: 50
- **brokenOnSomeMethods**: 12
- **guardBranches**: 172
- **unreachableOrDynamicGuards**: 82
- **campusSwitchCases**: 102
- **campusPrefixes**: 19
- **deadRouteFiles**: 122
- **interceptorBypasses**: ["/api/tts"]
- **preferLivePrefixes**: 27
- **needsManualCheck**: 0
- **byWorst**: {"REAL":102,"COMPUTE":5,"THROWS":3,"UNHANDLED-404":13,"STUB":43,"EXTERNAL":5,"CAMPUS-404":2,"BYPASSES-SHIM":1}
- **byBucket**: {"OK":102,"C":10,"B":13,"A":49}
- **byLayer**: {"firestoreRouter":111,"campusFallback":49,"none":13,"interceptor-bypass":1}
- **guardsByVerdict**: {"COMPUTE":4,"REAL":99,"STUB":52,"THROWS":9,"EXTERNAL":8}

**Verdict** — `REAL` reaches a datastore · `STUB` returns a literal · `THROWS` raises ApiError
· `EXTERNAL` calls out over the network · `COMPUTE` local computation only
· `UNHANDLED-404` no guard matches · `CAMPUS-404` campus switch has no case, default throws
· `BYPASSES-SHIM` interceptor exempts it, so the Firebase `**` rewrite answers with index.html.

**Bucket** — `A` port to client · `B` needs a trusted server · `C` genuinely stateless · `OK` already real.

## Broken no matter how they are called (50)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/attendance/identify` | THROWS | B | firestoreRouter | client.ts:3223 | — | 0/1 |
| `/api/attention-span/analytics` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/attention-span/analytics/route.ts | 2/3 |
| `/api/attention-span/leaderboard` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/attention-span/leaderboard/route.ts | 1/2 |
| `/api/avatar/context` | STUB | A | firestoreRouter | client.ts:2723 | — | 2/4 |
| `/api/avatar/memory` | STUB | A | firestoreRouter | client.ts:3180 | — | 2/4 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:714 | — | 0/2 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:715 | — | 1/2 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:1630 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:1629 | — | 1/2 |
| `/api/code/run-java` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/code/run-python/route.ts | 1/2 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:1465 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:1464 | — | 0/1 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:1467 | — | 0/2 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:1468 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:1466 | — | 1/2 |
| `/api/gd/history` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/gd/history/route.ts | 3/5 |
| `/api/github/ingest` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/github/ingest/route.ts | 2/4 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications/:param/read` | STUB | A | firestoreRouter | client.ts:1188 | — | 1/2 |
| `/api/opportunities/applications` | STUB | A | firestoreRouter | client.ts:1196 | — | 0/1 |
| `/api/opportunities/match` | STUB | A | firestoreRouter | client.ts:1195 | — | 0/1 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1264 | /api/payment/create-order/route.ts | 0/3 |
| `/api/payment/verify` | THROWS | B | firestoreRouter | client.ts:1268 | /api/payment/verify/route.ts | 1/2 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:1462 | — | 0/1 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:1460 | — | 0/2 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:1461 | — | 0/1 |
| `/api/portfolio/analyze-certificate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-endorsement` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/portfolio/verify-endorsement/route.ts | 2/4 |
| `/api/portfolio/verify-exam` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/projects/generate/route.ts | 1/2 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/settings/erp/sync` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/execute` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/validate` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/rollout/feedback` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/stt` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/stt/route.ts | 2/4 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |
| `/api/university/dashboard` | STUB | A | firestoreRouter | client.ts:1973 | — | 0/1 |
| `/api/university/employability-report` | STUB | A | firestoreRouter | client.ts:2022 | — | 0/1 |
| `/api/university/skill-gaps` | STUB | A | firestoreRouter | client.ts:2038 | — | 0/1 |
| `/api/v1/auth/exchange-session` | STUB | A | firestoreRouter | client.ts:313 | — | 1/2 |
| `/api/v1/auth/logout-all` | STUB | A | firestoreRouter | client.ts:407 | — | 1/2 |
| `/api/v1/auth/vault-approve` | STUB | A | firestoreRouter | client.ts:273 | — | 0/1 |

## Broken only on some methods (12)

These resolve to a working handler for at least one HTTP method. Confirm which
method the call site actually uses before treating one as a defect.

- `/api/avatar/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/chat` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/interview/evaluate` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/opportunities` — broken on POST, PUT, PATCH, DELETE; works on GET
- `/api/resume/:param/improve` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/generate-from-vault` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/structured` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/resume/upload` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault` — broken on PUT, PATCH, DELETE; works on GET, POST
- `/api/vault/delete` — broken on GET, PUT, PATCH, DELETE; works on POST
- `/api/vault/upload` — broken on GET, PUT, PATCH, DELETE; works on POST

## All paths (174)

| path | verdict | bucket | layer | handler | spec route | direct/total |
|---|---|---|---|---|---|---|
| `/api/admin/audit-log` | REAL | OK | firestoreRouter | client.ts:2202 | /api/admin/audit-log/route.ts | 0/1 |
| `/api/admin/audit-log/add` | REAL | OK | firestoreRouter | client.ts:2202 | — | 5/10 |
| `/api/admin/users` | REAL | OK | firestoreRouter | client.ts:2202 | /api/admin/users/route.ts | 1/2 |
| `/api/admin/users/:param` | REAL | OK | firestoreRouter | client.ts:2202 | — | 1/2 |
| `/api/admin/users/:param/role` | REAL | OK | firestoreRouter | client.ts:2202 | — | 1/2 |
| `/api/admissions/apply` | REAL | OK | campusFallback | campusFallback.ts:158 | — | 1/2 |
| `/api/advisor/admin/alert` | REAL | OK | campusFallback | campusFallback.ts:247 | /api/advisor/admin/alert/route.ts | 1/2 |
| `/api/advisor/admin/risks` | REAL | OK | campusFallback | campusFallback.ts:245 | /api/advisor/admin/risks/route.ts | 0/1 |
| `/api/advisor/performance` | REAL | OK | campusFallback | campusFallback.ts:241 | /api/advisor/performance/route.ts | 0/1 |
| `/api/advisor/quest/complete` | REAL | OK | campusFallback | campusFallback.ts:243 | /api/advisor/quest/complete/route.ts | 0/1 |
| `/api/alumni/donate` | COMPUTE | C | campusFallback | campusFallback.ts:300 | — | 0/1 |
| `/api/alumni/mentorship-request` | REAL | OK | campusFallback | campusFallback.ts:296 | — | 0/1 |
| `/api/alumni/referral-request` | REAL | OK | campusFallback | campusFallback.ts:298 | — | 0/1 |
| `/api/alumni/stats` | REAL | OK | campusFallback | campusFallback.ts:282 | /api/alumni/stats/route.ts | 0/1 |
| `/api/analytics/dashboard` | REAL | OK | firestoreRouter | client.ts:1198 | — | 0/3 |
| `/api/attendance/identify` | THROWS | B | firestoreRouter | client.ts:3223 | — | 0/1 |
| `/api/attention-span/analytics` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/attention-span/analytics/route.ts | 2/3 |
| `/api/attention-span/leaderboard` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/attention-span/leaderboard/route.ts | 1/2 |
| `/api/auth/face/enroll` | COMPUTE | C | firestoreRouter | client.ts:509 | /api/auth/face/enroll/route.ts | 2/4 |
| `/api/auth/face/enrolled` | COMPUTE | C | firestoreRouter | client.ts:505 | — | 1/2 |
| `/api/auth/face/verify` | COMPUTE | C | firestoreRouter | client.ts:513 | /api/auth/face/verify/route.ts | 1/2 |
| `/api/auth/me` | REAL | OK | firestoreRouter | client.ts:431 | — | 0/4 |
| `/api/auth/onboarding` | REAL | OK | firestoreRouter | client.ts:445 | — | 18/36 |
| `/api/auth/profile` | REAL | OK | firestoreRouter | client.ts:433 | — | 19/38 |
| `/api/auth/teacher` | REAL | OK | firestoreRouter | client.ts:444 | — | 1/2 |
| `/api/avatar/chat` | STUB | A | firestoreRouter | client.ts:3180 | — | 2/5 |
| `/api/avatar/context` | STUB | A | firestoreRouter | client.ts:2723 | — | 2/4 |
| `/api/avatar/memory` | STUB | A | firestoreRouter | client.ts:3180 | — | 2/4 |
| `/api/cache/hash` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/1 |
| `/api/cache/stats` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | — | 1/2 |
| `/api/career-builder/generate` | REAL | OK | firestoreRouter | client.ts:736 | — | 0/2 |
| `/api/career-dna/profile` | REAL | OK | firestoreRouter | client.ts:710 | — | 0/1 |
| `/api/career-dna/scores` | REAL | OK | firestoreRouter | client.ts:709 | — | 0/1 |
| `/api/career-twin/results` | STUB | A | firestoreRouter | client.ts:714 | — | 0/2 |
| `/api/career-twin/run` | STUB | A | firestoreRouter | client.ts:715 | — | 1/2 |
| `/api/chat` | STUB | A | firestoreRouter | client.ts:1631 | — | 1/2 |
| `/api/chat/history/:param` | STUB | A | firestoreRouter | client.ts:1630 | — | 1/2 |
| `/api/chat/session` | STUB | A | firestoreRouter | client.ts:1629 | — | 1/2 |
| `/api/code/run-java` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/code/run-java/route.ts | 1/2 |
| `/api/code/run-python` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/code/run-python/route.ts | 1/2 |
| `/api/communication/all` | REAL | OK | campusFallback | campusFallback.ts:217 | — | 0/1 |
| `/api/communication/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:563 | — | 0/1 |
| `/api/consultant/analytics` | REAL | OK | firestoreRouter | client.ts:2056 | — | 0/1 |
| `/api/consultant/pipeline` | REAL | OK | firestoreRouter | client.ts:2056 | — | 0/1 |
| `/api/consultant/sessions` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/3 |
| `/api/consultant/student/:param` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/2 |
| `/api/consultant/student/:param/task` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/2 |
| `/api/consultant/student/:param/task/:param` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/1 |
| `/api/consultant/student/:param/verify-document` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/2 |
| `/api/consultant/student/add` | REAL | OK | firestoreRouter | client.ts:2056 | — | 1/2 |
| `/api/documents/mine` | REAL | OK | campusFallback | campusFallback.ts:120 | /api/documents/mine/route.ts | 0/1 |
| `/api/documents/request` | REAL | OK | campusFallback | campusFallback.ts:122 | — | 0/1 |
| `/api/events/rsvp` | REAL | OK | campusFallback | campusFallback.ts:263 | /api/events/rsvp/route.ts | 0/1 |
| `/api/events/stats` | REAL | OK | campusFallback | campusFallback.ts:261 | /api/events/stats/route.ts | 0/1 |
| `/api/exam/:param/questions` | STUB | A | firestoreRouter | client.ts:1465 | — | 0/1 |
| `/api/exam/available` | STUB | A | firestoreRouter | client.ts:1464 | — | 0/1 |
| `/api/exam/results` | STUB | A | firestoreRouter | client.ts:1467 | — | 0/2 |
| `/api/exam/scheduled` | STUB | A | firestoreRouter | client.ts:1468 | — | 0/1 |
| `/api/exam/sync-result` | STUB | A | firestoreRouter | client.ts:1466 | — | 1/2 |
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
| `/api/group-discussion/bot-reply` | EXTERNAL | C | firestoreRouter | client.ts:1650 | /api/group-discussion/bot-reply/route.ts | 2/4 |
| `/api/group-discussion/evaluate` | EXTERNAL | C | firestoreRouter | client.ts:1677 | /api/group-discussion/evaluate/route.ts | 1/2 |
| `/api/hostel/checkout-visitor` | REAL | OK | campusFallback | campusFallback.ts:68 | /api/hostel/checkout-visitor/route.ts | 0/1 |
| `/api/hostel/log-attendance` | REAL | OK | campusFallback | campusFallback.ts:60 | /api/hostel/log-attendance/route.ts | 0/1 |
| `/api/hostel/raise-complaint` | REAL | OK | campusFallback | campusFallback.ts:62 | /api/hostel/raise-complaint/route.ts | 0/1 |
| `/api/hostel/register-visitor` | REAL | OK | campusFallback | campusFallback.ts:66 | /api/hostel/register-visitor/route.ts | 0/1 |
| `/api/hostel/request-room` | REAL | OK | campusFallback | campusFallback.ts:58 | /api/hostel/request-room/route.ts | 0/1 |
| `/api/hostel/stats` | REAL | OK | campusFallback | campusFallback.ts:56 | /api/hostel/stats/route.ts | 0/1 |
| `/api/interview/assist` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/assist/route.ts | 1/2 |
| `/api/interview/chat` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/chat/route.ts | 1/2 |
| `/api/interview/evaluate` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/evaluate/route.ts | 2/4 |
| `/api/interview/generate-problem` | STUB | B | firestoreRouter | client.ts:1455 | /api/interview/generate-problem/route.ts | 1/2 |
| `/api/interview/history` | REAL | OK | firestoreRouter | client.ts:1442 | /api/interview/history/route.ts | 2/4 |
| `/api/library/books` | REAL | OK | campusFallback | campusFallback.ts:84 | /api/library/books/route.ts | 0/1 |
| `/api/library/borrow` | REAL | OK | campusFallback | campusFallback.ts:86 | /api/library/borrow/route.ts | 0/1 |
| `/api/library/reserve` | REAL | OK | campusFallback | campusFallback.ts:90 | /api/library/reserve/route.ts | 0/1 |
| `/api/library/return` | REAL | OK | campusFallback | campusFallback.ts:88 | /api/library/return/route.ts | 0/1 |
| `/api/llm` | EXTERNAL | C | firestoreRouter | client.ts:3181 | /api/llm/route.ts | 1/2 |
| `/api/maintenance/report` | REAL | OK | campusFallback | campusFallback.ts:208 | /api/maintenance/report/route.ts | 0/1 |
| `/api/maintenance/stats` | REAL | OK | campusFallback | campusFallback.ts:206 | /api/maintenance/stats/route.ts | 0/1 |
| `/api/messages/direct` | REAL | OK | firestoreRouter | client.ts:2442 | — | 1/2 |
| `/api/missions/generate-custom-skill` | REAL | OK | firestoreRouter | client.ts:558 | — | 1/2 |
| `/api/missions/history` | REAL | OK | firestoreRouter | client.ts:542 | — | 0/1 |
| `/api/missions/roleplay` | EXTERNAL | C | firestoreRouter | client.ts:682 | /api/missions/roleplay/route.ts | 3/6 |
| `/api/missions/streak` | REAL | OK | firestoreRouter | client.ts:708 | — | 0/1 |
| `/api/missions/submit` | REAL | OK | firestoreRouter | client.ts:543 | — | 2/4 |
| `/api/missions/today` | REAL | OK | firestoreRouter | client.ts:541 | — | 0/2 |
| `/api/notes` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notes/upload` | CAMPUS-404 | A | campusFallback | campusFallback.ts default: throws | — | 1/2 |
| `/api/notifications` | REAL | OK | firestoreRouter | client.ts:1186 | — | 0/1 |
| `/api/notifications/:param/read` | STUB | A | firestoreRouter | client.ts:1188 | — | 1/2 |
| `/api/notifications/mark-all-read` | REAL | OK | firestoreRouter | client.ts:1187 | — | 1/2 |
| `/api/opportunities` | STUB | A | firestoreRouter | client.ts:1189 | — | 0/2 |
| `/api/opportunities/applications` | STUB | A | firestoreRouter | client.ts:1196 | — | 0/1 |
| `/api/opportunities/apply` | REAL | OK | firestoreRouter | client.ts:1194 | — | 1/2 |
| `/api/opportunities/feed` | REAL | OK | firestoreRouter | client.ts:1189 | — | 0/1 |
| `/api/opportunities/match` | STUB | A | firestoreRouter | client.ts:1195 | — | 0/1 |
| `/api/parent/link-student` | REAL | OK | firestoreRouter | client.ts:1762 | — | 1/2 |
| `/api/parent/student/:param/overview` | REAL | OK | firestoreRouter | client.ts:1729 | — | 0/1 |
| `/api/parent/students` | REAL | OK | firestoreRouter | client.ts:1762 | — | 0/2 |
| `/api/payment/create-order` | THROWS | B | firestoreRouter | client.ts:1264 | /api/payment/create-order/route.ts | 0/3 |
| `/api/payment/status` | REAL | OK | firestoreRouter | client.ts:1236 | — | 0/1 |
| `/api/payment/verify` | THROWS | B | firestoreRouter | client.ts:1268 | /api/payment/verify/route.ts | 1/2 |
| `/api/personality/analyze` | STUB | A | firestoreRouter | client.ts:1462 | — | 0/1 |
| `/api/personality/report` | STUB | A | firestoreRouter | client.ts:1460 | — | 0/2 |
| `/api/personality/session` | STUB | A | firestoreRouter | client.ts:1461 | — | 0/1 |
| `/api/pins/balance` | REAL | OK | firestoreRouter | client.ts:1203 | — | 0/1 |
| `/api/pins/earn` | REAL | OK | firestoreRouter | client.ts:1207 | — | 2/4 |
| `/api/pins/spend` | REAL | OK | firestoreRouter | client.ts:1219 | — | 3/6 |
| `/api/portfolio/analyze-certificate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/portfolio/analyze-certificate/route.ts | 1/2 |
| `/api/portfolio/verify-endorsement` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/portfolio/verify-endorsement/route.ts | 2/4 |
| `/api/portfolio/verify-exam` | UNHANDLED-404 | A | none | client.ts throws Unhandled API path | /api/portfolio/verify-exam/route.ts | 1/2 |
| `/api/projects/generate` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/projects/generate/route.ts | 1/2 |
| `/api/quests/verify` | REAL | OK | firestoreRouter | client.ts:2542 | — | 0/1 |
| `/api/recruiter/activity-log` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/2 |
| `/api/recruiter/analytics` | REAL | OK | firestoreRouter | client.ts:1835 | — | 0/1 |
| `/api/recruiter/applications` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/3 |
| `/api/recruiter/candidate/:param` | REAL | OK | firestoreRouter | client.ts:1835 | — | 0/1 |
| `/api/recruiter/candidates` | REAL | OK | firestoreRouter | client.ts:1835 | — | 0/1 |
| `/api/recruiter/company` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/3 |
| `/api/recruiter/contact-request` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/2 |
| `/api/recruiter/jobs` | REAL | OK | firestoreRouter | client.ts:1835 | — | 2/5 |
| `/api/recruiter/jobs/:param` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/2 |
| `/api/recruiter/pipeline` | REAL | OK | firestoreRouter | client.ts:1835 | — | 0/1 |
| `/api/recruiter/schedule-interview` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/2 |
| `/api/recruiter/shortlist` | REAL | OK | firestoreRouter | client.ts:1835 | — | 1/2 |
| `/api/recruiter/visibility` | REAL | OK | firestoreRouter | client.ts:1970 | — | 1/2 |
| `/api/research/publish-paper` | REAL | OK | campusFallback | campusFallback.ts:273 | /api/research/publish-paper/route.ts | 0/1 |
| `/api/research/stats` | REAL | OK | campusFallback | campusFallback.ts:271 | /api/research/stats/route.ts | 0/1 |
| `/api/resume/:param/improve` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/resume/generate-from-vault` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/2 |
| `/api/resume/list` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/resume/structured` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/resume/structured/:param/enhance` | REAL | OK | firestoreRouter | client.ts:1165 | — | 0/1 |
| `/api/resume/structured/me` | REAL | OK | firestoreRouter | client.ts:719 | — | 0/1 |
| `/api/resume/suggestions` | STUB | A | firestoreRouter | client.ts:1179 | — | 0/1 |
| `/api/resume/upload` | STUB | A | firestoreRouter | client.ts:1179 | — | 2/4 |
| `/api/services/apply-leave` | REAL | OK | campusFallback | campusFallback.ts:228 | /api/services/apply-leave/route.ts | 1/2 |
| `/api/services/book-appointment` | REAL | OK | campusFallback | campusFallback.ts:232 | /api/services/book-appointment/route.ts | 1/2 |
| `/api/services/book-counselling` | REAL | OK | campusFallback | campusFallback.ts:234 | /api/services/book-counselling/route.ts | 1/2 |
| `/api/services/file-request` | REAL | OK | campusFallback | campusFallback.ts:230 | /api/services/file-request/route.ts | 2/4 |
| `/api/services/stats` | REAL | OK | campusFallback | campusFallback.ts:226 | /api/services/stats/route.ts | 0/1 |
| `/api/settings/erp/sync` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/execute` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/migration/validate` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/settings/rollout/feedback` | STUB | A | campusFallback | campusFallback.ts:306 | — | 0/1 |
| `/api/stt` | UNHANDLED-404 | B | none | client.ts throws Unhandled API path | /api/stt/route.ts | 2/4 |
| `/api/study/complete` | REAL | OK | firestoreRouter | client.ts:1727 | — | 1/2 |
| `/api/teacher/students` | REAL | OK | firestoreRouter | client.ts:2396 | — | 0/2 |
| `/api/teacher/training/submit` | REAL | OK | firestoreRouter | client.ts:2462 | — | 1/2 |
| `/api/transport/register` | REAL | OK | campusFallback | campusFallback.ts:106 | /api/transport/register/route.ts | 0/1 |
| `/api/transport/stats` | REAL | OK | campusFallback | campusFallback.ts:104 | /api/transport/stats/route.ts | 0/1 |
| `/api/trust/evaluate` | REAL | OK | firestoreRouter | client.ts:1458 | — | 1/2 |
| `/api/trust/score` | REAL | OK | firestoreRouter | client.ts:1457 | — | 0/1 |
| `/api/tts` | BYPASSES-SHIM | A | interceptor-bypass | src/lib/fetchInterceptor.ts | /api/tts/route.ts | 3/6 |
| `/api/university/dashboard` | STUB | A | firestoreRouter | client.ts:1973 | — | 0/1 |
| `/api/university/employability-report` | STUB | A | firestoreRouter | client.ts:2022 | — | 0/1 |
| `/api/university/skill-gaps` | STUB | A | firestoreRouter | client.ts:2038 | — | 0/1 |
| `/api/v1/auth/exchange-session` | STUB | A | firestoreRouter | client.ts:313 | — | 1/2 |
| `/api/v1/auth/logout-all` | STUB | A | firestoreRouter | client.ts:407 | — | 1/2 |
| `/api/v1/auth/vault-approve` | STUB | A | firestoreRouter | client.ts:273 | — | 0/1 |
| `/api/v1/auth/vault-challenge` | REAL | OK | firestoreRouter | client.ts:159 | — | 0/1 |
| `/api/vault` | STUB | A | firestoreRouter | client.ts:1182 | — | 2/5 |
| `/api/vault/delete` | STUB | A | firestoreRouter | client.ts:1185 | /api/vault/delete/route.ts | 1/2 |
| `/api/vault/upload` | STUB | A | firestoreRouter | client.ts:1184 | /api/vault/upload/route.ts | 0/3 |
