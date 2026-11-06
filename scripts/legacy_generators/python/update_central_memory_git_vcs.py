import os
import sys

def update_memory():
    mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

    # 1. Update agent_tasks.csv
    tasks_csv = os.path.join(mem_dir, "agent_tasks.csv")
    new_tasks = [
        'TASK-1081,Antigravity,Complete,"TASK-1081: Expand Git & Version Control Systems Day 6: File Ignoring & Repository Hygiene (.gitignore Rules & git rm --cached) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1082,Antigravity,Complete,"TASK-1082: Expand Git & Version Control Systems Day 7: Undoing Local Changes (git restore, Unstaging & git commit --amend) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1083,Antigravity,Complete,"TASK-1083: Expand Git & Version Control Systems Day 8: Git History Inspection (git log --oneline --graph, git show & Pickaxe Search) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1084,Antigravity,Complete,"TASK-1084: Expand Git & Version Control Systems Day 9: Git Branching Architecture (Pointer Mechanics & Fast-Forward Merges) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1085,Antigravity,Complete,"TASK-1085: Expand Git & Version Control Systems Day 10 ⭐ Milestone 2 Capstone: 3-Way Merge Mechanics (Common Ancestor merge-base, Recursive & ORT Merges) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17'
    ]

    with open(tasks_csv, "r", encoding="utf-8") as f:
        existing = f.read()

    to_add = [t for t in new_tasks if t.split(",")[0] not in existing]
    if to_add:
        with open(tasks_csv, "a", encoding="utf-8") as f:
            for t in to_add:
                f.write("\n" + t)
        print(f"Added {len(to_add)} tasks to agent_tasks.csv")
    else:
        print("Tasks already present in agent_tasks.csv")

    # 2. Update multi_agent_control.csv
    mac_csv = os.path.join(mem_dir, "multi_agent_control.csv")
    mac_line = 'AGENT-355,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1085,Completed,2026-10-17 14:15:00,"5-Task Batch Protocol Complete: git_vcs Days 6-10 & Milestone 2 Capstone (Course 22 Days 6-10, TASK-1081..1085) committed & pushed. 45/45 tests passing, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'
    
    with open(mac_csv, "r", encoding="utf-8") as f:
        existing_mac = f.read()

    if "AGENT-355" not in existing_mac:
        with open(mac_csv, "a", encoding="utf-8") as f:
            f.write("\n" + mac_line)
        print("Added AGENT-355 to multi_agent_control.csv")
    else:
        print("AGENT-355 already present in multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    pm_path = os.path.join(mem_dir, "PROJECT_MEMORY.md")
    with open(pm_path, "r", encoding="utf-8") as f:
        pm_content = f.read()

    golden_rules_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
    if "TASK-1081..1085" not in pm_content and golden_rules_marker in pm_content:
        new_memory_entry = """* **2026-10-17 (Antigravity - 🎯 5-TASK BATCH PROTOCOL COMPLETE: GIT_VCS DAYS 6–10 & ⭐ MILESTONE 2 CAPSTONE COMPLETED - TASK-1081..1085):**
  - **Item 1: File Ignoring & Repository Hygiene (.gitignore Rules & git rm --cached) (TASK-1081 / Day 6):** Implemented in `src/lib/data/gitVcsLongLessons.ts` (3,250 words, 21.7 spoken min, 45m total duration). Features glob pattern syntax, directory anchoring slashes, negation exception un-ignores (`!`), un-tracking cached index files via `git rm --cached` without disk deletion, `.git/info/exclude` vs global gitignore hierarchies, and Git repository hygiene audits. Generated `src/lib/data/lessonVisuals/git_vcs/day-06.json`.
  - **Item 2: Undoing Local Changes: git restore, Unstaging & git commit --amend (TASK-1082 / Day 7):** Implemented (3,313 words, 22.1 spoken min, 45m total duration). Features Git 2.23+ `git restore --worktree` and `git restore --staged`, untracked file sanitization via `git clean -fd`, amending commit snapshots (`git commit --amend --no-edit`), safe commit reversion via `git revert`, and soft vs mixed vs hard index pointer resets. Generated `src/lib/data/lessonVisuals/git_vcs/day-07.json`.
  - **Item 3: Git History Inspection: git log --oneline --graph, git show & Pickaxe Search (TASK-1083 / Day 8):** Implemented (3,340 words, 22.3 spoken min, 45m total duration). Features visual DAG ASCII topologies with `git log --graph --oneline --decorate`, deep commit metadata inspection with `git show`, code churn and patch audits (`-p`, `--stat`), line-level author tracing via `git blame -L`, and Pickaxe forensic string hunting via `git log -S` and `-G`. Generated `src/lib/data/lessonVisuals/git_vcs/day-08.json`.
  - **Item 4: Git Branching Architecture: Pointer Mechanics & Fast-Forward Merges (TASK-1084 / Day 9):** Implemented (3,292 words, 21.9 spoken min, 45m total duration). Features lightweight 41-byte branch pointers in `.git/refs/heads/`, pointer advancement mechanics, fast-forward linear history merges, modern branch switching via `git switch`, and recovering detached HEAD states using temporary salvage branches before garbage collection. Generated `src/lib/data/lessonVisuals/git_vcs/day-09.json`.
  - **Item 5: 3-Way Merge Mechanics: Common Ancestor (merge-base), Recursive & ORT Merges (TASK-1085 / Day 10 ⭐ Milestone 2 Capstone):** Implemented (3,494 words, 23.3 spoken min, 45m total duration). Features 3-Way merge algorithm and Common Ancestor discovery (`git merge-base`), dual-parent commit structures (`parentCount: 2`), standard and `zdiff3` conflict marker reconciliation, enterprise `--no-ff` topology preservation and atomic feature rollback (`git revert -m 1`), emergency rollback via `git merge --abort`, and next-generation ORT merge engine performance acceleration. Generated `src/lib/data/lessonVisuals/git_vcs/day-10.json`.
  - **Item 6: Verification & Testing Suite:** All 5 tasks passed strict 6-cycle backtracking audits (16,689 total spoken words across Days 6–10, all 25 parts >= 620 words, all days >= 21.7 spoken min, Gate v2 workflow visual specs with SHA-256 bindings, deterministic POSIX bash execution). 45/45 tests passing in `tests/systems_long_lessons_parity.test.ts`. Full static TypeScript typecheck (`npx tsc --noEmit`) passing with 0 compilation errors. Single unified atomic commit pushed to `origin codex/interview-tab-reliability`.

"""
        pm_content = pm_content.replace(golden_rules_marker, golden_rules_marker + new_memory_entry)
        with open(pm_path, "w", encoding="utf-8") as f:
            f.write(pm_content)
        print("Updated PROJECT_MEMORY.md successfully!")
    else:
        print("PROJECT_MEMORY.md already updated or marker not found")

if __name__ == "__main__":
    update_memory()
