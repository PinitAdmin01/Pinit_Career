# 📋 MASTER SPRINT SPECIFICATION: 10/10 PRODUCTION LOCKDOWN
**Target System**: Present Career OS (`Vinay-N-Kashyap/Present-Career-os`)  
**Sprint Objective**: Eliminate all cross-layer architectural seams, enforce fail-closed boundaries, prevent Vercel build breaker regressions, and guarantee 100% production uptime.  
**Baseline**: Zero TypeScript Compiler Errors (`npx tsc --noEmit` exits with Code 0).

---

## 🚦 UNIVERSAL GATEWAY FOR ALL 4 FRIENDS (NON-NEGOTIABLE)

Before pushing any commit or merging any branch into `main`, **EVERY FRIEND MUST RUN**:
```bash
npx tsc --noEmit && npx next lint
```
> [!CAUTION]
> **Zero errors permitted.** If even a single compiler warning, lint error, or broken dependency is detected, the push must be aborted immediately. Never push broken code to `main`.

---

# 🛡️ FRIEND 1: Security, Cryptography & Auth Specialist

**Domain**: Content Security Policy (CSP), JWT Auth Middleware, Bypass Gates, Rate Limiting, Webhook Secrets & Anti-Tampering.

### 📋 Executive Instructions
- **What You Are Responsible For**: Hardening all HTTP ingress points, ensuring authentication is fail-closed, protecting secrets from leaking into client bundles, and guaranteeing that CSP headers do not crash browser subsystem dependencies (e.g. Three.js Draco WebAssembly).
- **Primary Risks**: Over-tightening CSP headers breaks the 3D mentor avatar; leaving dev bypass gates active in production creates administrative privilege escalation.

### ✅ WHAT YOU MUST DO:
1. **Preserve WebAssembly in CSP**: In both `next.config.js` and `firebase.json`, `script-src` must strictly include `'wasm-unsafe-eval' 'unsafe-eval'`. Three.js decodes 3D avatars using Draco WebAssembly. If omitted, Chrome/Edge blocks WebAssembly and the 3D avatar crashes with a blank canvas.
2. **Keep Device Permissions Open**: `Permissions-Policy` must remain `camera=(self), microphone=(self)`. Setting them to `()` disables webcams and microphones origin-wide, breaking facial login and AI voice mock interviews.
3. **Strict Production Auth Gating**: In `src/lib/server/requireAuth.ts`, dev bypass tokens must strictly require:
   ```typescript
   if (process.env.ALLOW_DEV_AUTH_BYPASS === 'true' && process.env.NODE_ENV !== 'production' && (token === 'demo-token-bypass' || token.startsWith('test-token-')))
   ```
   In production (`NODE_ENV === 'production'`), authentic Supabase JWTs are strictly mandatory.

### ❌ WHAT YOU MUST NEVER DO:
- **NEVER** tighten `script-src` by stripping `'wasm-unsafe-eval'` or `'unsafe-eval'`.
- **NEVER** set `Permissions-Policy: camera=(), microphone=()`.
- **NEVER** commit service role keys or sensitive tokens to client `.env` files.
- **NEVER** allow dev bypass tokens to resolve or bypass verification in a production environment.

### 🎯 Detailed Sprint Tasks:

#### Task 1.1: WebAssembly & CSP Automated Regression Guard
- **Problem**: Inadvertent security tightening has previously stripped `'wasm-unsafe-eval'` from CSP headers, causing silent WebAssembly crashes.
- **Target Files**:
  - [`next.config.js`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/next.config.js)
  - [`firebase.json`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/firebase.json)
  - `audit/check-headers.mjs`
- **Implementation**:
  - In `audit/check-headers.mjs`, add an explicit verification that `script-src` in both config files contains both `'wasm-unsafe-eval'` and `'unsafe-eval'`.
  - If either is missing, exit with Code 1 and log `SEVERITY: BROKEN`.
  - Assert that `Permissions-Policy` contains `camera=(self)` and `microphone=(self)`.
- **Verification Command**:
  ```bash
  npm run audit:headers
  ```

#### Task 1.2: DDOS & Memory Leak Protection on Unauthenticated Endpoints
- **Problem**: In-memory rate limiting maps on unauthenticated routes grow indefinitely under sustained bot scans.
- **Target Files**:
  - [`src/app/api/admissions/track/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/admissions/track/route.ts)
  - [`src/app/api/auth/face/challenge/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/auth/face/challenge/route.ts)
- **Implementation**:
  - Add an automatic prune sweep (clearing IPs older than 15 minutes) or LRU bound to keep memory usage under 10MB.
  - Retain `export const dynamic = 'force-dynamic'` at the top of route files.
- **Verification Command**:
  ```bash
  npm run test:security
  ```

#### Task 1.3: Structured Token Expiry Error Payloads
- **Problem**: When JWT tokens expire, client receives generic 401 errors instead of actionable token expiration codes.
- **Target File**:
  - [`src/lib/server/requireAuth.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/server/requireAuth.ts)
- **Implementation**:
  - Differentiate expired tokens (`err.message.includes('expired')`) and return `{ error: 'TOKEN_EXPIRED', message: 'Token expired', status: 401 }`.
  - Ensure all dev tokens require `ALLOW_DEV_AUTH_BYPASS === 'true' && NODE_ENV !== 'production'`.
- **Verification Command**:
  ```bash
  npx tsx scripts/test_p0_security_remediations.ts
  ```

---

# 💰 FRIEND 2: Financial Ledger & Economy Specialist

**Domain**: Pins Economy, XP Progression, Scholarships, Dues, Payment Gateways & Distributed Concurrency.

### 📋 Executive Instructions
- **What You Are Responsible For**: Maintaining 100% mathematical and cryptographic integrity across student pins, tuition fee installments, scholarship waivers, and progression XP.
- **Primary Risks**: Client-side pin tampering, duplicate payment receipt collisions, and race-condition double claims across serverless container boundaries.

### ✅ WHAT YOU MUST DO:
1. **Register Every Route in `client.ts`**: Whenever a new endpoint is created under `src/app/api/...` (e.g. `/api/xp/*`, `/api/pins/*`), you **MUST** add its prefix to `LIVE_API_PREFIXES` in [`src/lib/api/client.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/api/client.ts). If omitted, the browser client intercepts the call locally, returns a 404, and freezes the UI.
2. **Use Cryptographic Receipt IDs**: All payment receipts and ledger records must use `generateTxId('rcp')` from [`src/lib/utils/transactionId.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/utils/transactionId.ts).
3. **Enforce Daily XP Caps on Server**: In [`src/app/api/xp/add/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/xp/add/route.ts), strictly validate against `VALID_ACTION_TYPES` (14 actions) and enforce the rolling `DAILY_XP_MAX_CAP = 3000`. Reject unknown actions with HTTP 400.
4. **Fail-Closed Distributed Locks**: In [`src/lib/services/financeService.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/services/financeService.ts), `acquireDistributedLock` must return `false` in production if the database lock table is unreachable.

### ❌ WHAT YOU MUST NEVER DO:
- **NEVER** calculate or trust pin/XP balances on the client. The database is the sole authority.
- **NEVER** create an API endpoint without adding it to `LIVE_API_PREFIXES` in `client.ts`.
- **NEVER** allow mock payments when `NODE_ENV === 'production'`.
- **NEVER** generate payment receipt IDs using `Math.random()`.

### 🎯 Detailed Sprint Tasks:

#### Task 2.1: Automated Dual-Router Parity Linter
- **Problem**: The onboarding progress screen previously froze at 100% because `/api/xp` was missing from `LIVE_API_PREFIXES` in `client.ts`.
- **Target Files**:
  - [`src/lib/api/client.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/api/client.ts)
  - `scripts/verify_api_parity.ts`
- **Implementation**:
  - Create `scripts/verify_api_parity.ts` to inspect all directories under `src/app/api/`.
  - For every endpoint that contains a `route.ts`, assert that its prefix is declared inside `LIVE_API_PREFIXES` in `client.ts`.
  - If any endpoint is missing, exit with Code 1.
- **Verification Command**:
  ```bash
  npx tsx scripts/verify_api_parity.ts
  ```

#### Task 2.2: Distributed Lock TTL Auto-Expiration
- **Problem**: If a serverless function crashes mid-transaction, orphaned rows in `payment_idempotency_keys` can lock students out indefinitely.
- **Target File**:
  - [`src/lib/services/financeService.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/services/financeService.ts)
- **Implementation**:
  - In `acquireDistributedLock()`, check `created_at` timestamp.
  - If existing lock is older than 45 seconds, reclaim it as expired and grant the lock.
  - Ensure fail-closed cleanup (`activePaymentLocks.delete(lockKey)`, `activeScholarshipLocks.delete(lockKey)`) and `return false` when database is down in production.
- **Verification Command**:
  ```bash
  node scripts/run_friend2_all.js
  ```

#### Task 2.3: XP Reason Metadata & Anti-Farming Verification
- **Problem**: Unchecked manual awards can lead to runaway XP inflation loops.
- **Target File**:
  - [`src/app/api/xp/add/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/xp/add/route.ts)
- **Implementation**:
  - Assert that all awards log the structured `[actionType]` prefix to `xp_ledger`.
  - Reject unknown actions with HTTP 400 `INVALID_ACTION_TYPE`.
  - Reject requests exceeding 3,000 XP/day with HTTP 429 `DAILY_XP_LIMIT_EXCEEDED`.
- **Verification Command**:
  ```bash
  npx tsx scripts/test_friend2_blueprint.ts
  ```

---

# 🗄️ FRIEND 3: Storage Authority & Data Architecture Specialist

**Domain**: Database Schema, Evidence Ledger, Multi-Tab CRDT, Storage Synchronization.

### 📋 Executive Instructions
- **What You Are Responsible For**: Storage consistency across PostgreSQL and browser storage, preventing Vercel build breaker regressions caused by malformed ESLint comments, and eliminating legacy database schemas.
- **Primary Risks**: Deploying `@typescript-eslint` comments that break Next.js build on Vercel; querying legacy `profiles` table leading to state divergence.

### ✅ WHAT YOU MUST DO:
1. **Use `users` as the Canonical Table**: Never query or update the legacy `profiles` table. All user state, competencies, and onboarding data must be read and written against `users`.
2. **Keep `transactionId.ts` Pure and Web-Standard**: Use native Web Crypto (`crypto.randomUUID()`) with the high-resolution monotonic sequence counter fallback.
3. **Batch IN Queries for Scale**: When resolving students or applicants, use batch PostgreSQL `IN` queries. Never query the database in sequential `for` loops (N+1 query anti-pattern).

### ❌ WHAT YOU MUST NEVER DO:
- **NEVER re-introduce `require('crypto')` or `@typescript-eslint` disable comments in `transactionId.ts`**: Our `.eslintrc.json` uses `next/core-web-vitals` without the `@typescript-eslint` plugin. Putting `// eslint-disable-next-line @typescript-eslint/...` in any file triggers an instant build failure on Vercel. This broke our deployment three times.
- **NEVER** split strings on `_` when handling primary keys.
- **NEVER** use Last-Write-Wins without timestamps for multi-tab storage synchronization.

### 🎯 Detailed Sprint Tasks:

#### Task 3.1: Pre-Commit Linter Guard for Broken ESLint Comments
- **Problem**: Dead `require('crypto')` blocks and `// eslint-disable-next-line @typescript-eslint/...` comments cause immediate Vercel build errors.
- **Target Files**:
  - [`src/lib/utils/transactionId.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/lib/utils/transactionId.ts)
  - `scripts/check_eslint_comments.js`
- **Implementation**:
  - Build `scripts/check_eslint_comments.js` to scan all `.ts` and `.tsx` files for `@typescript-eslint`.
  - If any occurrence is detected, exit with Code 1 and print: `"FATAL: @typescript-eslint comments are forbidden. Use standard ESLint rules only."`
- **Verification Command**:
  ```bash
  node scripts/check_eslint_comments.js && npx next lint
  ```

#### Task 3.2: Complete Elimination of Legacy `profiles` Queries
- **Problem**: Reading from `profiles` instead of `users` results in stale data and missing competencies.
- **Target Files**:
  - `src/lib/services/adminService.ts`
  - `src/lib/supabaseService.ts`
- **Implementation**:
  - Audit all database services to ensure zero queries target `profiles`.
  - Ensure all records map to canonical `users` using UUID v4 keys.
- **Verification Command**:
  ```bash
  npx tsx scripts/verify_friend3_full.ts
  ```

#### Task 3.3: Storage Quota Auto-Eviction Stress Testing
- **Problem**: Mobile browsers with low storage limits crash when `localStorage.setItem` throws `QuotaExceededError`.
- **Target Files**:
  - `src/lib/context/CareerOSContext.tsx`
  - `scripts/verify_subbatch_3_4.ts`
- **Implementation**:
  - Ensure `safeLocalStorageSetItem` intercepts `QuotaExceededError`.
  - Auto-evict cached diagnostic logs and test runs while strictly preserving user credentials, tokens, and credentials.
- **Verification Command**:
  ```bash
  npx tsx scripts/verify_subbatch_3_4.ts
  ```

---

# 🤖 FRIEND 4: AI Engines, 3D Avatar & Code Evaluation Specialist

**Domain**: CodeWars Evaluation Sandbox, Three.js VRoid Engine, Voice/TTS Pipelines, Onboarding Flow.

### 📋 Executive Instructions
- **What You Are Responsible For**: Reliable rendering of the 3D mentor avatar, safe and isolated code execution in CodeWars, fluid voice synthesis without audio collision, and uninterrupted student onboarding.
- **Primary Risks**: Untrusted code escaping evaluation sandboxes; WebGL crashes hanging the UI; ambient sound overlapping TTS speech.

### ✅ WHAT YOU MUST DO:
1. **Keep Avatar Load Gating & Fallbacks Intact**: In [`VRoidAvatarEngine.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/components/avatar/VRoidAvatarEngine.ts) and [`VRoidInterviewAvatar.tsx`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/components/avatar/VRoidInterviewAvatar.tsx), preserve the `onReady` hook, loading spinner overlay, and the 8s safety timeout. If GLB loading fails or takes too long, degrade to the 2D SVG portrait.
2. **Strict Problem Registry in Code Evaluation**: In [`src/app/api/code/evaluate/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/code/evaluate/route.ts), evaluate all code submissions against `CODEWARS_PROBLEM_REGISTRY`. Return HTTP 400 `UNSUPPORTED_PROBLEM` for unknown problem IDs.
3. **Preserve Navigation Fallbacks in Onboarding**: In [`src/app/onboarding/page.tsx`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/onboarding/page.tsx), always keep the `window.location.href = '/dashboard'` timeout fallback after `router.push('/dashboard')` so students never get stuck at 100%.

### ❌ WHAT YOU MUST NEVER DO:
- **NEVER** use raw `new Function()` or `eval()` for code execution. Always use the isolated `node:vm` sandbox.
- **NEVER** auto-pass code submissions when problem IDs are unrecognized.
- **NEVER** let the WebGL avatar engine hang indefinitely without triggering the 2D fallback.
- **NEVER** allow procedural ambient audio to play simultaneously over voice synthesis.

### 🎯 Detailed Sprint Tasks:

#### Task 4.1: Avatar Background Preloader & Fallback Hardening
- **Problem**: 6.4MB avatar GLBs take noticeable time to download on mobile connections, causing freezing if initiated synchronously.
- **Target Files**:
  - [`src/components/avatar/VRoidAvatarEngine.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/components/avatar/VRoidAvatarEngine.ts)
  - [`src/components/avatar/VRoidInterviewAvatar.tsx`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/components/avatar/VRoidInterviewAvatar.tsx)
- **Implementation**:
  - Retain `onReady` callback, spinner overlay, and 8s timeout.
  - Trigger `preloadAvatarGLB()` when student enters lobby so caching begins before interview starts.
  - On `webglcontextlost`, immediately fallback to the 2D SVG portrait.
- **Verification Command**:
  ```bash
  npx tsc --noEmit
  ```

#### Task 4.2: CodeWars Problem Registry Expansion & Sandbox Security
- **Problem**: Running code without strict problem registries or timeouts risks infinite loop denial-of-service.
- **Target File**:
  - [`src/app/api/code/evaluate/route.ts`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/api/code/evaluate/route.ts)
- **Implementation**:
  - Expand `CODEWARS_PROBLEM_REGISTRY` with problem definitions.
  - Verify that `validateVmCodeSecurity` blocks forbidden tokens (`process`, `require`, `child_process`, `eval`, `Function`, `__proto__`).
  - Enforce the 2,500ms timeout around `script.runInContext`.
- **Verification Command**:
  ```bash
  npx tsx scripts/verify_blueprint_friend4.ts
  ```

#### Task 4.3: Onboarding Instant Navigation Lock
- **Problem**: Student onboarding modal previously hung on "Orchestrating Trajectory OS 100%" if Next.js router transitions were delayed.
- **Target File**:
  - [`src/app/onboarding/page.tsx`](file:///c:/Users/vinay/Desktop/project%20working/Present-Career-os/src/app/onboarding/page.tsx)
- **Implementation**:
  - Keep `window.location.href = '/dashboard'` hard fallback in `handleOnboardingComplete` and `handleExpressSubmit`.
  - Guarantee navigation triggers within 1.2 seconds of reaching 100%.
- **Verification Command**:
  ```bash
  npx tsx scripts/verify_friend4_full.ts
  ```

---

## 📊 SPRINT SUMMARY MATRIX

| Friend | Primary Domain | Critical Deliverable | Verification Command | Gate Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Friend 1** | Security, CSP & Auth | Keep `'wasm-unsafe-eval'` in CSP, bounded rate limiting, secure dev bypass | `npm run audit:headers && npm run test:security` | 0 findings |
| **Friend 2** | Economy & Concurrency | Dual-router parity, distributed lock TTL (45s), server daily XP cap (3,000) | `node scripts/run_friend2_all.js` | 162/162 Passed |
| **Friend 3** | Storage & DB Canonicalization | Ban `@typescript-eslint` comments, eradicate `profiles`, quota-safe storage | `node scripts/check_eslint_comments.js && npx tsx scripts/verify_friend3_full.ts` | 27/27 Passed |
| **Friend 4** | AI, Avatars & CodeWars | Avatar preloading & 2D fallback, node:vm CodeWars sandbox, onboarding redirect | `npx tsx scripts/verify_blueprint_friend4.ts && npx tsx scripts/verify_friend4_full.ts` | 57/57 Passed |
| **ALL** | Production Build | Clean TypeScript compilation and Next.js linting | `npx tsc --noEmit && npx next lint` | 0 errors |
