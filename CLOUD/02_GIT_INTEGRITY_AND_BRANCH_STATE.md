# Document 02 — Git Integrity and Branch State

**Workspace Root**: `<repo-root>` (`Present-Career-os`)  
**Current Branch**: `main`  
**Target Commit SHA**: `5d887012c9a1668eed74960d0b6560e5aa663f92`  
**Inspection Date**: 2026-11-13T11:45:00+05:30  
**Verification Method**: Read-Only Local Git Plumbing & Worktree Diagnostics  

---

## 1. Branch Identity & Worktree Conflict Resolution

A perceived contradiction existed between the active Git checkout (`main`) and local workspace instructions (`AGENTS.md`) mentioning `Branch B`:

### A. The 4 Concurrent Git Worktrees (Verified via `git worktree list`)
```
Worktree Path                                   Commit   Branch
-------------------------------------------------------------------------------------------------
<workspace-root>/Present-Career-os             5d887012 [main]
<workspace-root>/Present-Career-os-commerce    b770805f [agent/branch-b-curriculum-commerce-iot]
<workspace-root>/Present-Career-os-platform    b8e249d1 [agent/branch-c-platform-admin-faculty]
<workspace-root>/Present-Career-os-tech        bc6f2674 [agent/branch-a-curriculum-tech]
```

### B. Root Cause of the `AGENTS.md` Conflict
1. The active session is operating inside the primary integration workspace `<workspace-root>/Present-Career-os` on branch **`main`**.
2. Commit `41036b7d` (`docs(directive): establish Branch B task assignment for Commerce Month 2`) was previously committed directly into `main`. Consequently, `AGENTS.md` carries historical Branch B instructions.
3. The dedicated worktree for Branch B is actually `<workspace-root>/Present-Career-os-commerce`.
4. Commit `5d887012` (`feat(curriculum): complete 100% verified live python certification track`) was authored and committed on `main`.
5. **Operating Mandate**: In accordance with instructions, we remain on `main` at `5d887012` and do not switch branches or mutate other worktrees.

---

## 2. Tracked Working-Tree State

The local Git working tree was audited using strict Git plumbing commands:

```powershell
# 1. Verification of staged changes in the tracked index:
git diff --cached --name-status
# Result: 0 files (Output is completely empty)

# 2. Verification of unstaged changes in tracked files:
git diff --name-status
# Result: 0 files (Output is completely empty)
```

**Verification Finding**:  
All tracked files in the repository are in a 100% clean state corresponding precisely to commit `5d887012`. Zero tracked files have been edited, created, or deleted.

---

## 3. Comprehensive Inventory of Untracked Items (142 Items Total)

Execution of `git ls-files --others --exclude-standard` discovers exactly **142 untracked items**. These divide cleanly into two categories:

### A. Category 1: Untracked Documentation Package (10 Items in `CLOUD/`)
The staged intelligence dossier created for external model review:
- `CLOUD/INDEX.md`
- `CLOUD/01_SYSTEM_AND_TOOLCHAIN_PROFILE.md`
- `CLOUD/02_GIT_INTEGRITY_AND_BRANCH_STATE.md`
- `CLOUD/03_CODEBASE_ARCHITECTURE_MAP.md`
- `CLOUD/04_GRAPHIFY_INTELLIGENCE_EXTRACT.md`
- `CLOUD/05_CURRICULUM_TAXONOMY_RECONCILIATION.md`
- `CLOUD/06_TEST_AND_DIAGNOSTICS_BASELINE.md`
- `CLOUD/07_TYPESCRIPT_DIAGNOSTIC_DOSSIER.md`
- `CLOUD/08_SECURITY_AND_EXCLUSIONS_AUDIT.md`
- `CLOUD/09_AI_REGRESSION_RISK_ANALYSIS.md`

### B. Category 2: Untracked Developer Scripts (132 Items in `scripts/`)
All 132 files are located exclusively inside [`scripts/`](file:///./scripts):
- **Verification & Parity (35 files)**: e.g., `scripts/verify_only_d4.py`, `scripts/inspect_curriculum_quality.py`, `scripts/show_part.ts`.
- **Audit & Metrics (18 files)**: e.g., `scripts/audit_d1_details.py`, `scripts/check_d2_counts.py`.
- **Legacy Generators & Remediation (79 files)**: e.g., `scripts/rebuild_d1_accounting.py`, `scripts/remediate_all_bcom_marketing.py`.

**Preservation Mandate**:  
**All 142 untracked files are preserved without modification, staging, or deletion.**

---

## 4. Ignored Generated Files ([`.gitignore`](file:///./.gitignore))

Git strictly ignores non-source artifacts to prevent repository corruption:
- Build caches & dependencies: `node_modules/`, `.next/`, `out/`, `/dist/`, `coverage/`, `*.tsbuildinfo`
- Runtime WebAssembly bundles: `public/pyodide/`, `public/sql/`, `public/esbuild/`, `public/sandbox/`
- Runtime data caches: `src/generated/`
- Credentials: `.env*`, `src/lib/data/face_biometrics_db.json`, `dump.rdb`
- Graphify artifacts: `graphify-out/`
- Test logs: `test-results/`, `playwright-report/`, `screenshots/`, `tests/*.txt`

---

## 5. Remote Tracking Reference Parity vs. Live Remote Verification

### A. Cached Tracking-Reference Parity (Verified)
```powershell
git rev-parse HEAD; git rev-parse origin/main; git rev-parse pinit-admin/main
# Output:
# 5d887012c9a1668eed74960d0b6560e5aa663f92 (HEAD)
# 5d887012c9a1668eed74960d0b6560e5aa663f92 (refs/remotes/origin/main)
# 5d887012c9a1668eed74960d0b6560e5aa663f92 (refs/remotes/pinit-admin/main)
```
- Divergence checks (`git log origin/main..HEAD` and `HEAD..origin/main`) return empty (0 ahead, 0 behind).

### B. Engineering Distinction: Cached Refs vs. Live Network Query
- **Verified Fact**: Local `HEAD` is identical to cached tracking references `origin/main` and `pinit-admin/main` at commit `5d887012`.
- **Operational Boundary**: A live network query (`git fetch --dry-run` or `git ls-remote`) was **not performed** in this read-only pass to avoid outbound network hangs or authentication prompts. Parity is guaranteed relative to the last recorded upstream fetch.
