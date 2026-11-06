# scripts/sync_central_memory_git_batch1.py
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

print("=== SYNCING CENTRAL SHARED MEMORY FOR COURSE 20 GIT_VCS BATCH 1 ===")

# 1. Update agent_tasks.csv
updated_tasks = []
batch_task_ids = {"TASK-1222", "TASK-1223", "TASK-1224", "TASK-1225", "TASK-1226"}
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
        if row and row[0] == "AGENT-387":
            row[5] = "Completed"
            row[6] = now_str
            row[7] = ("5-Task Batch Protocol Complete: Month 2 Pioneer Batch 1 — Course 20 git_vcs Days 31-35: "
                      "Packfiles & Indices, Git Index Binary Layout, Delta Compression, Garbage Collection/MIDX & "
                      "ApexPlumbing Milestone 4 Capstone (TASK-1222..1226) committed & pushed. "
                      "15,907 words (all 5 days >= 25.5 spoken min, avg 26.5 min/day), 70/70 parity tests passing, "
                      "0 tsc errors, Gate v2 workflow visual JSONs with SHA-256 bindings. "
                      "Course 20 advances to 35/60 Days (58.3%)!")
            print(f"Updated AGENT-387 -> Completed")
        updated_control.append(row)

with open(control_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(updated_control)
print(f"Saved {control_path} successfully.")

# 3. Update PROJECT_MEMORY.md
summary_entry = f"""
### 🚀 [2026-10-17 {datetime.now().strftime('%H:%M')}] AGENT-387: Course 20 Month 2 Pioneer Batch 1 (`git_vcs` Days 31–35: Packfiles, Index DIRC Internals, Delta Compression, MIDX & ApexPlumbing Milestone 4 Capstone) — COMPLETED
- **Branch**: `codex/interview-tab-reliability` (Branch A, main repository)
- **Tasks Completed**: `TASK-1222` to `TASK-1226`
- **Key Modules Authored & Verified**:
  1. **Day 31 (`TASK-1222`)**: `Packfiles & Pack Indices: .pack and .idx Binary Layout, Fan-Out Tables & Delta Compression` (3,089 words, 25.7 min spoken duration). Deconstructed 12-byte binary header, 256-entry first-level fan-out table, CRC32 tables, and SHA trailer verification.
  2. **Day 32 (`TASK-1223`)**: `The Git Index (.git/index) Binary Internals: DIRC Header, 40-Byte Stat Cache & Tree Cache Extension` (3,110 words, 25.9 min spoken duration). 12-byte DIRC header, 40-byte POSIX stat cache, rsync sub-second timestamp truncation post-mortem, 4 conflict stage slots (0..3), and cached TREE extension.
  3. **Day 33 (`TASK-1224`)**: `Delta Compression & Object Deduplication: Sliding Window Algorithms, Max Delta Depth & Thin Packs` (3,370 words, 28.1 min spoken duration). Sliding-window sorting heuristics, copy/insert bytecode opcodes, Acyclic Bounded Delta Depth Invariant (`pack.depth <= 50`), Thin Pack transport protocol, and `core.bigFileThreshold` memory protection.
  4. **Day 34 (`TASK-1225`)**: `Garbage Collection, MIDX & Alternate Stores: git gc, git prune, Multi-Pack-Index & info/alternates` (3,279 words, 27.3 min spoken duration). Multi-Pack-Index (MIDX v1), shared alternates accidental prune catastrophe and virtual ref namespaces, commit-graph binary acceleration with topological generation numbers (83x speedup), and object quarantine isolation.
  5. **Day 35 (`TASK-1226`)**: `Milestone 4 (M2): ApexPlumbing Custom Git Object Database & Packfile Decoder Suite` (3,059 words, 25.5 min spoken duration). Zero-dependency binary decoder architecture, forensic repair of truncated SHA trailer checksums, OFS_DELTA `+1` accumulator variable-length integer decoding, commit-graph binary walker with early topological cutoffs, and formal Capstone Viva Defense.
- **Pedagogical & Structural Invariants**:
  - Total Words: **15,907 words** (all 15 parts strictly $\\ge 580$ words, average 3,181 words/day, average 26.5 spoken minutes/day).
  - All 25 bash code snippets validated deterministically in POSIX virtual shell (`bashRunner`).
  - Visual specs authored in `src/lib/data/lessonVisuals/git_vcs/day-31.json` through `day-35.json` with matching SHA-256 `codeHash` bindings and `"workflow"` template.
  - Socratic checks: 4 options each, valid index (0..3), substantial pedagogical explanation (`why`).
  - Test Parity: `tests/systems_long_lessons_parity.test.ts` updated with 5 comprehensive test blocks; **70/70 tests passing**.
  - TypeScript Compiler: `npx tsc --noEmit` **0 errors**.
- **Course Status**: Course 20 (`git_vcs`) advances from 30/60 Days (50.0%) to **35/60 Days (58.3%)**!

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
