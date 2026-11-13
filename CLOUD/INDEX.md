# PinIT Career OS — Codebase Intelligence & Stabilization Dossier
**Root Manifest & System Dossier**

- **Workspace Path**: `<repo-root>` (`Present-Career-os`)
- **Active Git Branch**: `main` (See Section 1 for Branch Identity & Worktree Analysis)
- **Target Commit SHA**: `5d887012c9a1668eed74960d0b6560e5aa663f92`
- **Dossier Revision**: 2.3 (Final Evidence Correction & Full Reconciliation)
- **Dossier Date**: 2026-11-13T12:30:00+05:30
- **Operational Mode**: Stage 2.3 Controlled Codebase Intelligence Analysis (Strict Read-Only)
- **Authoring Architecture**: Multi-Model Engineering Team (Antigravity Coordinator + Independent Auditor)

---

## 1. Executive Summary & Branch Identity Reconciliation

This dossier establishes empirical, contract-verified codebase intelligence for **PinIT Career OS**, an enterprise Learning Management System (LMS) comprising ~1 GB of source code, 55 catalog courses (including 36 canonical blueprint courses), 2 master certification tracks (360-day foundation / 720-day expanded programs), client-side WebAssembly runtimes (Pyodide, PGlite), an isolated Cloud Run grading tier, and a multi-tiered AI avatar/voice lecture subsystem.

### Branch Identity & Worktree Analysis:
An initial ambiguity existed between the repository's active branch (`main`) and workspace directives mentioning `Branch B`:
- **Current Active Worktree**: `<workspace-root>/Present-Career-os` is checked out on branch **`main`** at commit `5d887012c9a1668eed74960d0b6560e5aa663f92` (`feat(curriculum): complete 100% verified live python certification track`).
- **Concurrent Worktrees**: Git worktree inspection (`git worktree list`) confirms 4 concurrent worktrees:
  1. `<workspace-root>/Present-Career-os` on branch `main` at `5d887012` (Integration & Audit root).
  2. `<workspace-root>/Present-Career-os-commerce` on branch `agent/branch-b-curriculum-commerce-iot` at `b770805f`.
  3. `<workspace-root>/Present-Career-os-platform` on branch `agent/branch-c-platform-admin-faculty` at `b8e249d1`.
  4. `<workspace-root>/Present-Career-os-tech` on branch `agent/branch-a-curriculum-tech` at `bc6f2674`.
- **Reason for `AGENTS.md` Conflict**: Commit `41036b7d` merged the Branch B directive document into `main`. The current audit workspace operates on **`main`** at `5d887012`, preserving all concurrent worktree boundaries without switching branches.

---

## 2. Document Registry

| File | Document Title | Scope & Forensic Purpose |
| :--- | :--- | :--- |
| [`01_SYSTEM_AND_TOOLCHAIN_PROFILE.md`](./01_SYSTEM_AND_TOOLCHAIN_PROFILE.md) | System & Toolchain Profile | Runtime environment (Node v24.19, npm 11.17, Python 3.12.14), OS, sanitized paths, and package topology. |
| [`02_GIT_INTEGRITY_AND_BRANCH_STATE.md`](./02_GIT_INTEGRITY_AND_BRANCH_STATE.md) | Git Integrity & Branch State | Tracked clean verification, inventory of 142 untracked items (132 scripts + 10 CLOUD docs), cached tracking ref parity vs live remote limits. |
| [`03_CODEBASE_ARCHITECTURE_MAP.md`](./03_CODEBASE_ARCHITECTURE_MAP.md) | Codebase Architecture Map | Next.js 14 App Router, 308 `route.ts` files (370 HTTP endpoints), dual-tier sandbox execution (Wasm vs Cloud Run compute/latency characteristics), destructive DDL alert on `supabase/schema.sql`, dormant Firebase scaffold. |
| [`04_GRAPHIFY_INTELLIGENCE_EXTRACT.md`](./04_GRAPHIFY_INTELLIGENCE_EXTRACT.md) | Graphify Intelligence Extract | Ground-truth metrics (31,886 nodes, 56,096 edges, 1,808 communities, 2,858 files), God nodes, and `.graphifyignore` data pipeline blind spots. |
| [`05_CURRICULUM_TAXONOMY_RECONCILIATION.md`](./05_CURRICULUM_TAXONOMY_RECONCILIATION.md) | Curriculum Taxonomy Reconciliation | Complete resolution of 360d foundation vs 720d dual/expanded tracks, shared SQL course store, 55 catalog courses vs 56 `id:` matches vs 36 blueprint courses. |
| [`06_TEST_AND_DIAGNOSTICS_BASELINE.md`](./06_TEST_AND_DIAGNOSTICS_BASELINE.md) | Test & Diagnostics Baseline | Granular deconstruction of 720 verified Python curriculum days across 2 test files (35 test cases) vs 632 unexecuted test files, test discovery mechanics, and ESLint warnings. |
| [`07_TYPESCRIPT_DIAGNOSTIC_DOSSIER.md`](./07_TYPESCRIPT_DIAGNOSTIC_DOSSIER.md) | TypeScript Diagnostic Dossier | Full AST failure decompilation of exactly 412 compiler errors across 4 files, line ranges, generator provenance (commits `9797c338` & `5d887012`), and zero consumer impact. |
| [`08_SECURITY_AND_EXCLUSIONS_AUDIT.md`](./08_SECURITY_AND_EXCLUSIONS_AUDIT.md) | Security & Exclusions Audit | Path exclusion boundaries, multi-pass regex content inspection, sanitized path enforcement, destructive SQL warning for `supabase/schema.sql`, and residual risk disclosures. |
| [`09_AI_REGRESSION_RISK_ANALYSIS.md`](./09_AI_REGRESSION_RISK_ANALYSIS.md) | AI Regression Risk Analysis | Systems engineering analysis of the AI failure loop, distinguishing empirically verified facts from explicit hypotheses. |
| [`10_VERIFICATION_EVIDENCE/README.md`](./10_VERIFICATION_EVIDENCE/README.md) | Fix 001 Verification Evidence | Verbatim pre-fix (412 errors) and post-fix (262 errors) TypeScript compiler logs, SHA-256 checksums, and regression proof. |
| [`11_MASTER_COURSE_AND_CURRICULUM_INVENTORY.md`](./11_MASTER_COURSE_AND_CURRICULUM_INVENTORY.md) | Master Course & Curriculum Inventory | Comprehensive inventory reconciling 35 regular courses, 1 certification program (PinIT Python Certification, 12 courses), 19 additional catalog items, 53 physical lesson stores, and 59 router prefixes. |

---

## 3. Strict Operating Invariants Observed

1. **Zero Source Modifications**: No files in `src/`, `scripts/`, `audit/`, `backend/`, or `tests/` were altered.
2. **Zero Database Migrations**: No schema updates, DDL scripts, or remote Supabase/Firebase mutations were executed.
3. **Preservation of Untracked Assets**: All 132 untracked developer scripts in `scripts/` remain completely intact.
4. **No Premature Compression**: `CLOUD.zip` has **not** been generated and will not be created until authorized.
5. **Path Sanitization**: All absolute local user paths (`<user-home>/...`) have been sanitized across all documents.
