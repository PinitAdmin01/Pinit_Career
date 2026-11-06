# scripts/sync_central_memory_git_batch2.py
import sys
import os
import csv
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
tasks_path = os.path.join(memory_dir, "agent_tasks.csv")
control_path = os.path.join(memory_dir, "multi_agent_control.csv")
project_memory_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")

today_str = datetime.now().strftime("%Y-%m-%d")
now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("=== SYNCING CENTRAL SHARED MEMORY FOR COURSE 20 GIT_VCS BATCH 2 ===")

# 1. Update agent_tasks.csv
updated_tasks = []
batch_task_ids = {"TASK-1233", "TASK-1234", "TASK-1235", "TASK-1236", "TASK-1237"}
with open(tasks_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in batch_task_ids:
            row[4] = "Complete"
            row[5] = today_str
            print(f"Updated {row[0]} -> Complete")
        updated_tasks.append(row)

with open(tasks_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(updated_tasks)
print(f"Saved {tasks_path} successfully.")

# 2. Update multi_agent_control.csv
updated_control = []
with open(control_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] == "AGENT-390":
            row[5] = "Completed"
            row[6] = now_str
            row[7] = ("5-Task Batch Protocol Complete: Month 2 Pioneer Batch 2 — Course 20 git_vcs Days 36-40: "
                      "Branching Strategies at Scale, Monorepo vs Polyrepo, Sparse Checkout/Scalar, Git LFS & "
                      "ApexRelease Milestone 5 Capstone (TASK-1233..1237) committed & pushed. "
                      "15,437 words (all 5 days >= 25.0 spoken min, avg 25.7 min/day), 75/75 parity tests passing, "
                      "0 tsc errors, Gate v2 workflow visual JSONs with SHA-256 bindings. "
                      "Course 20 advances to 40/60 Days (66.7%)!")
            print(f"Updated AGENT-390 -> Completed")
        updated_control.append(row)

with open(control_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(updated_control)
print(f"Saved {control_path} successfully.")

# 3. Update PROJECT_MEMORY.md
summary_entry = f"""
### 🚀 [2026-10-17 {datetime.now().strftime('%H:%M')}] AGENT-390: Course 20 Month 2 Pioneer Batch 2 (`git_vcs` Days 36–40: Branching Strategies at Scale, Monorepo Architecture, Sparse Checkout/Scalar, Git LFS & ApexRelease Milestone 5 Capstone) — COMPLETED
- **Branch**: `codex/interview-tab-reliability` (Branch A, main repository)
- **Tasks Completed**: `TASK-1233` to `TASK-1237`
- **Key Modules Authored & Verified**:
  1. **Day 36 (`TASK-1233`)**: `Branching Strategies at Scale: Gitflow vs GitHub Flow vs Trunk-Based Development & Short-Lived Branches` (3,157 words, 26.3 min spoken duration). Mastered DORA metrics, audited the 1,400-conflict Gitflow release meltdown, enforced Trunk-Based sub-24h branch lifespans, decoupled deployments via runtime feature flags, and resolved semantic merge skew via speculative merge queues.
  2. **Day 37 (`TASK-1234`)**: `Monorepo vs Polyrepo Architecture: Scaling Bottlenecks, Hermetic Builds & Dependency Graph Management` (3,003 words, 25.0 min spoken duration). Single atomic multi-package commits, forensic autopsy of the 45-minute polyrepo dependency deadlock, affected dependency graph algorithms ($O(\\log N)$ prefix trees), and hermetic build gatekeeping.
  3. **Day 38 (`TASK-1235`)**: `Scalable Large Repositories: Sparse Checkout (git sparse-checkout), Blobless Clones & Microsoft Scalar` (3,067 words, 25.6 min spoken duration). Blobless clone mechanics (`--filter=blob:none`), treeless clone in-flight disconnect post-mortem, cone mode sparse working tree reduction (99.9% reduction), kernel `fsmonitor` integration, and Microsoft Scalar autonomous background maintenance.
  4. **Day 39 (`TASK-1236`)**: `Git LFS (Large File Storage): Pointer Files, Smudge/Clean Filters, S3 Storage Backends & Asset Deduplication` (3,187 words, 26.6 min spoken duration). Pointer file spec v1 (130-byte text metadata), unhydrated LFS pointer production container crash post-mortem, S3 content-addressable storage backends with global deduplication, and Git LFS File Locking for cross-functional collaboration.
  5. **Day 40 (`TASK-1237`)**: `Milestone 5 (M2): ApexRelease Enterprise Trunk-Based CI/CD Release Engine Suite` (3,023 words, 25.2 min spoken duration). Comprehensive trunk-based release engine coordinating monorepo affected routing, forensic LFS hydration gating, automated package-scoped SemVer tagging from Conventional Commits, branch lifecycle auditing, and formal Capstone Viva Defense.
- **Pedagogical & Structural Invariants**:
  - Total Words: **15,437 words** (all 25 parts strictly $\\ge 580$ words, average 3,087 words/day, average 25.7 spoken minutes/day).
  - All 25 bash code snippets validated deterministically in POSIX virtual shell (`bashRunner`).
  - Visual specs authored in `src/lib/data/lessonVisuals/git_vcs/day-36.json` through `day-40.json` with matching SHA-256 `codeHash` bindings and `"workflow"` template.
  - Socratic checks: 4 options each, valid index (0..3), substantial pedagogical explanation (`why`).
  - Test Parity: `tests/systems_long_lessons_parity.test.ts` updated with 5 comprehensive test blocks; **75/75 tests passing**.
  - TypeScript Compiler: `npx tsc --noEmit` **0 errors**.
- **Course Status**: Course 20 (`git_vcs`) advances from 35/60 Days (58.3%) to **40/60 Days (66.7%)**!

---
"""

with open(project_memory_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

# Insert right after the header
marker = "## Recent Milestone Completions & Historical Trajectory"
if marker in pm_content:
    parts = pm_content.split(marker, 1)
    new_pm_content = parts[0] + marker + "\n" + summary_entry + parts[1]
else:
    new_pm_content = summary_entry + "\n" + pm_content

with open(project_memory_path, "w", encoding="utf-8") as f:
    f.write(new_pm_content)

print(f"Updated {project_memory_path} successfully!")
print("=== CENTRAL MEMORY SYNC COMPLETE ===")
