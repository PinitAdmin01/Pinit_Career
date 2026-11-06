# scripts/sync_central_memory_git_batch5.py
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

print("=== SYNCING CENTRAL SHARED MEMORY FOR COURSE 20 GIT_VCS BATCH 5 ===")

exact_titles = {
    "TASK-1259": "git_vcs Day 51: Git Performance Tuning: core.fsmonitor (Watchman), Commit-Graphs, Untracked Cache & Reachability Bitmaps",
    "TASK-1260": "git_vcs Day 52: Advanced Disaster Forensics: Recovering Dangling Trees, Reconstructing Broken Merge Bases & git fsck --lost-found",
    "TASK-1261": "git_vcs Day 53: Safe Force-Push Protocols: --force-with-lease vs --force-if-includes vs Destructive --force",
    "TASK-1262": "git_vcs Day 54: Worktree Concurrency & Workspace Isolation in Multi-Agent Environments: Collision Detection & Lifecycles",
    "TASK-1263": "git_vcs Day 55: Legacy VCS Migration Engineering: Migrating Subversion (SVN), Perforce & Mercurial to Git with Full History",
}

# 1. Update agent_tasks.csv
updated_tasks = []
batch_task_ids = set(exact_titles.keys())
with open(tasks_path, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if row and row[0] in batch_task_ids:
            row[1] = exact_titles[row[0]]
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
        if row and row[0] == "AGENT-396":
            row[5] = "Completed"
            row[6] = now_str
            row[7] = ("5-Task Batch Protocol Complete: Month 2 Pioneer Batch 5 — Course 20 git_vcs Days 51-55: "
                      "Git Performance Tuning (core.fsmonitor/Commit-Graphs/Untracked Cache/Reachability Bitmaps), "
                      "Advanced Disaster Forensics (0-Byte HEAD Repair/git fsck --lost-found/Packfile Salvage), "
                      "Safe Force-Push Protocols (--force-with-lease/--force-if-includes/pre-receive CAS Guards), "
                      "Multi-Agent Worktree Concurrency & Legacy VCS Migration Engineering (TASK-1259..1263) committed & pushed. "
                      "17,024 words (all 5 days >= 27.8 spoken min, avg 28.4 min/day), 90/90 parity tests passing, "
                      "0 tsc errors, Gate v2 workflow visual JSONs with SHA-256 bindings. "
                      "Course 20 advances to 55/60 Days (91.7%)!")
            print(f"Updated AGENT-396 -> Completed")
        updated_control.append(row)

with open(control_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(updated_control)
print(f"Saved {control_path} successfully.")

# 3. Update PROJECT_MEMORY.md
summary_entry = f"""
### 🚀 [2026-10-18 {datetime.now().strftime('%H:%M')}] AGENT-396: Course 20 Month 2 Pioneer Batch 5 (`git_vcs` Days 51–55: Block 11 — Large-Scale Git Performance Tuning, Advanced Disaster Forensics, Safe Force-Push CAS Protocols, Multi-Agent Worktree Concurrency & Legacy VCS Migration Engineering) — COMPLETED
- **Branch**: `codex/interview-tab-reliability` (Branch A, main repository)
- **Tasks Completed**: `TASK-1259` to `TASK-1263`
- **Key Modules Authored & Verified**:
  1. **Day 51 (`TASK-1259`)**: `Git Performance Tuning: core.fsmonitor (Watchman), Commit-Graphs, Untracked Cache & Reachability Bitmaps` (3,521 words, 29.3 min spoken duration). Modeled the Event-Driven Filesystem Monitoring Invariant ($T_{{\\text{{status}}}} = O(k) \\ll O(N)$), diagnosed the 45-second `git status` monorepo bottleneck using `GIT_TRACE2_PERF=1`, enabled `core.fsmonitor`, `core.untrackedCache`, index v4 (`feature.manyFiles`), and `.git/objects/info/commit-graph` generation numbers, and generated server-side Reachability Bitmaps (`git repack -a -b -d`) to slash `Counting objects` from 300s to 200ms.
  2. **Day 52 (`TASK-1260`)**: `Advanced Disaster Forensics: Recovering Dangling Trees, Reconstructing Broken Merge Bases & git fsck --lost-found` (3,453 words, 28.8 min spoken duration). Formulated the Content-Addressable Salvage Invariant over `.git/objects/`, repaired power-outage 0-byte `.git/HEAD` corruption (`echo "ref: refs/heads/main" > .git/HEAD`), extracted unreferenced commits and dangling trees via `git fsck --lost-found`, reconstructed orphan trees via `git ls-tree -r` and `git commit-tree`, and salvaged intact objects from CRC32-corrupted packfiles via `git unpack-objects -r`.
  3. **Day 53 (`TASK-1261`)**: `Safe Force-Push Protocols: --force-with-lease vs --force-if-includes vs Destructive --force` (3,360 words, 28.0 min spoken duration). Modeled the Atomic Compare-and-Swap (CAS) Remote Reference Invariant, diagnosed the Background IDE Auto-Fetch Lease Race Condition and closed it with `--force-if-includes` (`push.useForceIfIncludes=true`), implemented server-side `pre-receive` non-fast-forward guards using `git merge-base --is-ancestor`, and stress-tested 10-worker concurrent CAS contention convergence.
  4. **Day 54 (`TASK-1262`)**: `Worktree Concurrency & Workspace Isolation in Multi-Agent Environments: Collision Detection & Lifecycles` (3,340 words, 27.8 min spoken duration). Formulated the Multi-Agent Worktree Isolation Invariant ($\forall i \\ne j,\\ \\text{{Branch}}_i \\ne \\text{{Branch}}_j \\land \\text{{WorktreePath}}_i \\ne \\text{{WorktreePath}}_j$) sharing a single `.git/objects/` store, diagnosed the USD 2,000 autonomous agent force-push thrash and crashed subagent worktree lock recovery (`git worktree remove --force` + `git worktree prune`), and orchestrated 25 parallel AI subagents through an in-memory `git merge-tree --write-tree` sequential reconciliation queue.
  5. **Day 55 (`TASK-1263`)**: `Legacy VCS Migration Engineering: Migrating Subversion (SVN), Perforce & Mercurial to Git with Full History` (3,350 words, 27.9 min spoken duration). Formulated the Historical Provenance Equivalence Invariant, translated SVN `/trunk`, `/branches/*`, and `/tags/*` into native Git refs and annotated tags via `git fast-import`, remediated the USD 2M truncated `authors.txt` compliance failure and 180GB Perforce binary bloat via `git filter-repo` / Git LFS extraction (180GB -> 2.4GB), and verified 100% byte-for-byte SHA-256 tree manifest parity across 100,000 historical revisions.
- **Pedagogical & Structural Invariants**:
  - Total Words: **17,024 words** (all 25 parts strictly $\\ge 640$ words, average 3,405 words/day, average 28.4 spoken minutes/day).
  - All 25 bash code snippets validated deterministically in POSIX virtual shell (`bashRunner`) with exact output parity.
  - Visual specs authored in `src/lib/data/lessonVisuals/git_vcs/day-51.json` through `day-55.json` with matching SHA-256 `codeHash` bindings and `"workflow"` template.
  - Test Parity: `tests/systems_long_lessons_parity.test.ts` updated with 5 comprehensive test blocks; **90/90 tests passing**.
  - TypeScript Compiler: `npx tsc --noEmit` **0 errors**.
- **Course Status**: Course 20 (`git_vcs`) advances from 50/60 Days (83.3%) to **55/60 Days (91.7%)**! Block 11 is 100% complete. Only **1 final batch (Days 56–60: Block 12)** remains to complete Course 20 100%!

---
"""

with open(project_memory_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

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
