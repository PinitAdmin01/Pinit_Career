# Document 03 — Codebase Architecture Map

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T12:30:00+05:30  
**Verification Method**: Static Codebase Analysis & Route Decomposition  

---

## 1. System Topology & Dual-Tier Execution Engine

PinIT Career OS integrates a Next.js 14 web application, an in-browser WebAssembly execution engine, an isolated server-side Cloud Run grading judge, and an intelligent multi-tier voice narration subsystem:

```
+--------------------------------------------------------------------------------------------------+
|                                      NEXT.JS 14 APP ROUTER                                       |
+--------------------------------------------------------------------------------------------------+
          |                                      |                                   |
          v                                      v                                   v
+-----------------------+              +--------------------+              +-----------------------+
|  STUDENT EXPERIENCE   |              |  FACULTY / ADMIN   |              |   API ROUTE SURFACE   |
+-----------------------+              +--------------------+              +-----------------------+
| • /quests/lesson      |              | • /admin           |              | • 308 route.ts files  |
| • /learning           |              | • /teacher         |              | • 370 HTTP endpoints  |
| • /arena (Multiplayer)|              | • /admissions      |              |   (125 GET, 220 POST, |
| • /missions (Projects)|              | • /exams           |              |    1 PUT, 9 DELETE,   |
| • /portfolio          |              | • /alumni          |              |    15 PATCH)          |
+-----------------------+              +--------------------+              +-----------------------+
          |                                                                          |
          +--------------------------------------+-----------------------------------+
                                                 |
                                                 v
+--------------------------------------------------------------------------------------------------+
|                                  DUAL-TIER CODE EXECUTION ARCHITECTURE                           |
+------------------------------------------------+-------------------------------------------------+
| TIER 1: CLIENT-SIDE WASM SANDBOX               | TIER 2: SERVERLESS CLOUD RUN JUDGE              |
| (For Daily Interactive Curriculum Lessons)     | (For High-Stakes Exams & Competitive Arena)     |
+------------------------------------------------+-------------------------------------------------+
| • Pyodide Wasm CPython 3.11 (Python lessons)   | • cloud-run/python-judge (Docker + Seccomp)     |
| • PGlite Wasm PostgreSQL (SQL mastery lessons) | • cloud-run/java-judge (Isolated Java harness)  |
| • Esbuild-wasm (In-browser JS/TS bundling)     | • cloud-run/js-judge (Hardened Node.js sandbox) |
| • Compute: Client CPU/RAM (Pyodide ~15MB wheel,| • Compute: Isolated Docker + Seccomp container  |
|   ~1.5s cold boot, ~10-50ms subsequent exec)   | • Latency: 150-600ms network round-trip         |
| • Cost: Eliminates per-execution cloud bills   | • Timeout: 4,000ms judge watchdog               |
| • Scope: High-frequency daily practice         | • Scope: Tamper-evident exams & Arena combat    |
+------------------------------------------------+-------------------------------------------------+
```

---

## 2. Audio, Avatar & Voice Service Request Flow

The voice narration pipeline powers 15–18 minute interactive avatar teaching sessions.

Source files:
- Client Voice Router: [`src/lib/smartVoiceRouter.ts`](file:///./src/lib/smartVoiceRouter.ts) (Verified path; 312 lines).
- In-Browser Audio Cache: [`src/lib/voiceCacheDB.ts`](file:///./src/lib/voiceCacheDB.ts).
- FastAPI Voice Backend: [`backend/main.py`](file:///./backend/main.py) & [`backend/app/api/tts.py`](file:///./backend/app/api/tts.py).

### Complete Voice Request & Fallback Flow Diagram:

```
[Student in Lesson Page (/quests/lesson)]
                 |
                 v
   [useLessonEngine.ts (1,760 lines)]
                 |
                 | (Requests slide narration text)
                 v
   [src/lib/smartVoiceRouter.ts]
                 |
                 +---> [Level 1: Browser IndexedDB Cache (voiceCacheDB.ts)]
                 |       |
                 |       +-- (HIT) ---> Instant Audio Playback (<15ms retrieval)
                 |
                 +---> [Level 2: Remote FastAPI Backend]
                 |       |
                 |       v
                 |     [POST /api/tts to backend/app/api/tts.py OR
                 |      https://pinit-voice-service.onrender.com/api/v1/tts]
                 |       |
                 |       +---> [Level 3: Backend Redis / Disk Cache]
                 |       |       |
                 |       |       +-- (HIT) ---> Returns cached audio buffer
                 |       |
                 |       +---> [Neural TTS Synthesis Engine]
                 |               |
                 |               +-- (Generates Edge-TTS / ONNX audio buffer)
                 |
                 +---> [Level 4: Client-Side Native WebSpeech Fallback]
                         |
                         +-- (If network down or offline) -> speechSynthesis.speak()
```

---

## 3. Database Architecture Boundaries & Source of Truth

The repository employs distinct database tiers with strict functional boundaries:

```
+--------------------------------------------------------------------------------------------------+
|                                    DATABASE ARCHITECTURE BOUNDARIES                              |
+-----------------------------------+-----------------------------------+--------------------------+
| 1. AUTHORITATIVE PLATFORM DB      | 2. EDUCATIONAL SERVER LAB         | 3. IN-BROWSER SQL RUNNER |
|    (Supabase PostgreSQL)          |    (Prisma PostgreSQL)            |    (PGlite WebAssembly)  |
+-----------------------------------+-----------------------------------+--------------------------+
| • Sole Migration Authority:       | • Source: prisma/schema.prisma    | • Source: @electric-sql/ |
|   supabase/migrations/ (70+ SQL)  | • Mapped tables:                  |   pglite                 |
| • Bootstrapping Script:           |   - prisma_lab_customers          | • Embedded C PostgreSQL  |
|   supabase/schema.sql             |   - prisma_lab_orders             |   compiled to WebAssembly|
|   (WARNING: Initial CASCADE drops)|   - prisma_lab_order_items        | • Ephemeral or browser   |
| • Manages: users, profiles,       | • Scope: Educational backend lab  |   IndexedDB persistence. |
|   course_enrollments, quests,     |   for students to practice ORM    | • Scope: In-lesson SQL   |
|   pins_economy, arena_rooms,      |   mutations (server/prisma_lab/). |   interactive exercises. |
|   evidence_ledger, telemetry.     | • NOT the production platform DB. | • 0 server DB load.      |
| • Enforces Row Level Security.    |                                   |                          |
| • TypeScript definitions:         |                                   |                          |
|   src/types/database.ts (5,000+ L)|                                   |                          |
+-----------------------------------+-----------------------------------+--------------------------+
```

### Critical Architectural Alert on `supabase/schema.sql`:
- **Destructive Cascade Drops**: Lines 4–15 of [`supabase/schema.sql`](file:///./supabase/schema.sql) contain unconditional `DROP TABLE IF EXISTS public.<table_name> CASCADE;` statements across 11 core production tables:
  1. `users`
  2. `vault_items`
  3. `missions`
  4. `opportunities`
  5. `jobs`
  6. `applications`
  7. `notifications`
  8. `interview_sessions`
  9. `sessions`
  10. `audit_logs`
  11. `qr_login_sessions`
- **Architectural Function**: This file is strictly designed for initial, empty greenfield database bootstrapping. **It must NEVER be run as an incremental migration on an active staging or production database.**
- **Incremental Migration Authority**: The 70+ sequential SQL scripts inside [`supabase/migrations/`](file:///./supabase/migrations/) represent the sole authoritative migration chain for live database updates.
- **Legacy Scaffold Status**: [`src/lib/firebase.ts`](file:///./src/lib/firebase.ts) contains a legacy client configuration. A repository-wide code search confirmed **zero active consumers** in `src/`. All authentication and operational storage are handled by Supabase.

---

## 4. API Surface: 308 `route.ts` Files vs. 370 HTTP Endpoints

A forensic scan of the Next.js App Router surface under [`src/app/`](file:///./src/app/) clarifies the API structure:
- **Total `route.ts` Files**: Exactly **308 files**.
- **Exported HTTP Method Handlers**: Exactly **370 distinct callable HTTP endpoints**:
  - `POST` handlers: **220** (e.g. quest submission, auth nonces, admissions allocation, arena matchmaking).
  - `GET` handlers: **125** (e.g. platform telemetry, user profiles, seat matrix, room queries).
  - `PATCH` handlers: **15** (e.g. score overrides, status transitions).
  - `DELETE` handlers: **9** (e.g. room teardown, token revocation).
  - `PUT` handlers: **1** (idempotent resource upsert).

---

## 5. Architectural Hotspots & Key Source Files

1. **`src/app/quests/lesson/hooks/useLessonEngine.ts`**:
   - **Verified Line Count**: **1,760 lines**.
   - **Responsibilities**: Orchestrates lesson slides, audio narration queue, concept check validation, 5-day block test generation, and in-browser Pyodide execution.
2. **`src/lib/smartVoiceRouter.ts`**:
   - **Verified Path**: `src/lib/smartVoiceRouter.ts` (312 lines).
   - **Responsibilities**: Multi-tiered audio dispatching across IndexedDB, remote FastAPI, and browser WebSpeech.
3. **`src/types/database.ts`**:
   - **Verified Size**: >5,000 lines.
   - **Responsibilities**: Canonical TypeScript type definitions generated from Supabase PostgreSQL tables.
