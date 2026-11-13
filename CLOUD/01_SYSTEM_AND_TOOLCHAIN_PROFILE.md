# Document 01 — System and Toolchain Profile

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Inspection Date**: 2026-11-13T11:45:00+05:30  
**Verification Method**: Read-Only Local CLI Runtime Inspection  

---

## 1. Host Operating Environment & Core Runtimes

| Component | Verified Version | Execution Command | Output Reference / Evidence | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Operating System** | Windows 11 Enterprise (Build 26100, x64) | `[System.Environment]::OSVersion` | `Microsoft Windows NT 10.0.26100.0` | **VERIFIED** |
| **Node.js Runtime** | `v24.19.0` | `node -v` | `v24.19.0` | **VERIFIED** |
| **Package Manager** | npm `11.17.0` | `npm -v` | `11.17.0` | **VERIFIED** |
| **Python Runtime** | `3.12.14` | `python --version` | `Python 3.12.14` | **VERIFIED** |
| **Graphify CLI** | `0.9.99` | `graphify --version` | `graphify 0.9.99` (`<user-home>/.local/bin/graphify.exe`) | **VERIFIED** |
| **Git Version** | `2.48.1.windows.1` | `git --version` | `git version 2.48.1.windows.1` | **VERIFIED** |

---

## 2. Dependency Architecture (`package.json`)

Source file: [`package.json`](file:///./package.json)

### A. Core Framework & UI Runtime
- **Next.js**: `14.2.29` (App Router architecture with React Server Components, standalone client islands, and 308 `route.ts` API files).
- **React / React-DOM**: `18.3.0` (Client interactivity, state machines, custom audio/avatar hooks).
- **React Query**: `@tanstack/react-query ^5.28.0` (Server state caching and asynchronous optimistic mutations).
- **Code Editor**: `@monaco-editor/react ^4.7.0` (In-browser code editing for student quests and sandboxes).

### B. Client-Side Embedded Runtimes (Offloads Server Compute)
- **Pyodide**: `0.26.4` (Full CPython 3.11 compiled to WebAssembly running directly inside the student's browser sandbox to execute curriculum Python exercises without incurring server container concurrency limits).
- **PGlite**: `@electric-sql/pglite ^0.5.8` (PostgreSQL engine compiled to WebAssembly running in-browser via IndexedDB persistence for SQL curriculum exercises).
- **Esbuild / Esbuild-wasm**: `0.28.2` / `^0.28.2` (In-browser transpilation and bundling of student JavaScript/TypeScript projects).

### C. Backend, Authentication & Cryptography
- **Supabase**: `@supabase/supabase-js ^2.108.1` (Authoritative Postgres backend, Row Level Security policies, real-time presence).
- **Firebase**: `firebase ^10.9.0` (Legacy client scaffold; code audit confirms 0 active consumers in `src/`).
- **Argon2**: `@node-rs/argon2 ^2.2.0` (High-performance native password hashing).
- **JOSE**: `jose ^6.2.12` (JWT signing, verification, and tamper-evident student session cookies).
- **BullMQ**: `bullmq 6.3.4` (Redis-backed job queue for background tasks and asynchronous telemetry processing).

---

## 3. Build & Pre-Compilation Pipeline

The project relies on heavy pre-compilation steps specified in `package.json`:

```json
"scripts": {
  "predev": "node scripts/utils/build-long-lessons-json.cjs && node scripts/utils/copy-pyodide.cjs && node scripts/utils/build-sql-worker.cjs && node scripts/utils/copy-esbuild.cjs && node scripts/utils/build-react-runtime.cjs && node scripts/utils/build-web-runtime.cjs",
  "dev": "next dev -p 3000",
  "prebuild": "node scripts/utils/build-long-lessons-json.cjs && node scripts/utils/copy-pyodide.cjs && node scripts/utils/build-sql-worker.cjs && node scripts/utils/copy-esbuild.cjs && node scripts/utils/build-react-runtime.cjs && node scripts/utils/build-web-runtime.cjs",
  "build": "next build",
  "lint": "node scripts/utils/check_eslint_comments.js && next lint",
  "test": "node scripts/utils/run-tests.cjs"
}
```

### Purpose of Pre-Build Utilities:
1. `build-long-lessons-json.cjs`: Extracts metadata from the 53 physical `*LongLessons.ts` files into lightweight runtime JSON caches in `src/generated/` to prevent Next.js bundle bloat.
2. `copy-pyodide.cjs`: Copies WebAssembly binaries (`pyodide.asm.wasm`, `pyodide.asm.js`, packages) into `public/pyodide/` for browser static serving.
3. `build-sql-worker.cjs`: Packages PGlite WebAssembly worker scripts into `public/sql/` and `public/sql-worker/`.
4. `copy-esbuild.cjs`: Stages `esbuild.wasm` for student client-side bundler execution.
5. `build-react-runtime.cjs` & `build-web-runtime.cjs`: Pre-bundles standalone sandbox runners.

---

## 4. Operational Invariants & Security Boundaries

1. **Path Sanitization**: All references to host user paths have been sanitized to `<repo-root>` to allow safe sharing with external reasoning models.
2. **Offline Execution**: Pyodide assets and PGlite binaries are served locally from `public/` rather than external CDNs, ensuring deterministic execution in restricted environments.
