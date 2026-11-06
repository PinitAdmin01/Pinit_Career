import os
import sys

def update_memory():
    mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

    # 1. Update agent_tasks.csv
    tasks_csv = os.path.join(mem_dir, "agent_tasks.csv")
    new_tasks = [
        'TASK-1086,Antigravity,Complete,"TASK-1086: Expand Git & Version Control Systems Day 11: Merge Conflict Detection & Resolution (Conflict Markers <<<<<<< HEAD, Unmerged Stages 1/2/3 & zdiff3) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1087,Antigravity,Complete,"TASK-1087: Expand Git & Version Control Systems Day 12: Git Stash & Work-in-Progress (WIP) Preservation (stash save, pop, apply, -u Untracked & Stash Branch) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1088,Antigravity,Complete,"TASK-1088: Expand Git & Version Control Systems Day 13: Git Tagging & Release Management (Lightweight Tags, Annotated Tags, SemVer 2.0.0 & Cryptographic GPG/SSH Signatures) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1089,Antigravity,Complete,"TASK-1089: Expand Git & Version Control Systems Day 14: Time-Travel & Reset Modes (Soft --soft, Mixed --mixed, Hard --hard & Reflog Recovery) with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1090,Antigravity,Complete,"TASK-1090: Expand Git & Version Control Systems Day 15 ⭐ MILESTONE 2 CAPSTONE: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17'
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
    mac_line = 'AGENT-356,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1090,Completed,2026-10-17 14:40:00,"5-Task Batch Protocol Complete: git_vcs Days 11-15 & Milestone 2 Intermediate Capstone (Course 22 Days 11-15, TASK-1086..1090) committed & pushed. 50/50 tests passing, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'
    
    with open(mac_csv, "r", encoding="utf-8") as f:
        existing_mac = f.read()

    if "AGENT-356" not in existing_mac:
        with open(mac_csv, "a", encoding="utf-8") as f:
            f.write("\n" + mac_line)
        print("Added AGENT-356 to multi_agent_control.csv")
    else:
        print("AGENT-356 already present in multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    pm_path = os.path.join(mem_dir, "PROJECT_MEMORY.md")
    with open(pm_path, "r", encoding="utf-8") as f:
        pm_content = f.read()

    golden_rules_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
    if "TASK-1086..1090" not in pm_content and golden_rules_marker in pm_content:
        new_memory_entry = """* **2026-10-17 (Antigravity - 🎯 5-TASK BATCH PROTOCOL COMPLETE: GIT_VCS DAYS 11–15 & ⭐ MILESTONE 2 CAPSTONE COMPLETED - TASK-1086..1090):**
  - **Item 1: Merge Conflict Detection & Resolution (Conflict Markers, Unmerged Index Stages & zdiff3) (TASK-1086 / Day 11):** Implemented in `src/lib/data/gitVcsLongLessons.ts` (3,322 words, 22.1 spoken min, 45m total duration). Features conflict marker anatomy (`<<<<<<< HEAD`, `=======`, `>>>>>>>`), unmerged index stages (Stage 1 Base, Stage 2 Ours, Stage 3 Theirs), surgical conflict synthesis without residual artifacts, common ancestor context via `merge.conflictStyle = zdiff3`, and automated merge conflict resolution verification suites. Generated `src/lib/data/lessonVisuals/git_vcs/day-11.json`.
  - **Item 2: Git Stash & Work-in-Progress (WIP) Preservation (stash save, pop, apply, -u Untracked & Branch) (TASK-1087 / Day 12):** Implemented (3,219 words, 21.5 spoken min, 45m total duration). Features LIFO stash stack indexing (`stash@{0}`..`stash@{n}`), dual and tri-commit DAG representations, `pop` vs `apply` lifecycles, `-u` (`--include-untracked`) and `-a` (`--all`) complete sterilization scopes, patch-mode selective stashing (`-p`), conflict-free `git stash branch` resurrection, and dangling commit recovery via `git fsck`. Generated `src/lib/data/lessonVisuals/git_vcs/day-12.json`.
  - **Item 3: Git Tagging & Release Management: Lightweight Tags, Annotated Tags & SemVer (TASK-1088 / Day 13):** Implemented (3,235 words, 21.6 spoken min, 45m total duration). Features lightweight 41-byte pointer refs vs first-class annotated tag database objects in `.git/objects/`, SemVer 2.0.0 tripartite version schemas (`MAJOR.MINOR.PATCH`), cryptographic GPG/SSH digital signatures (`git tag -s`) and validation (`git tag -v`), selective remote tag synchronization (`--follow-tags`) and upstream pruning (`--prune-tags`), and automated release manifest and changelog generation. Generated `src/lib/data/lessonVisuals/git_vcs/day-13.json`.
  - **Item 4: Time-Travel & Reset Modes: Soft (--soft), Mixed (--mixed), Hard (--hard) & Reflog (TASK-1089 / Day 14):** Implemented (3,251 words, 21.7 spoken min, 45m total duration). Features Three Trees mutation matrices across `--soft` (HEAD only, staged preservation), `--mixed` (HEAD + Index, unstaged working tree preservation), and `--hard` (destructive three-tree overwrite), safe public branch roll-forward recovery via `git revert`, `.git/logs/HEAD` flight data recorder telemetry via `git reflog`, and instant point-in-time branch resurrection (`git reset --hard HEAD@{1}`). Generated `src/lib/data/lessonVisuals/git_vcs/day-14.json`.
  - **Item 5: ⭐ MILESTONE 2 CAPSTONE: Complete Branching, 3-Way Merge Conflict Resolution, Stash & Reflog Recovery Engine (TASK-1090 / Day 15):** Implemented (3,242 words, 21.6 spoken min, 45m total duration). Grand synthesis certifying intermediate version control mastery: branch pointer DAG concurrency and fast-forward evaluation, 3-way merge-base computation (`git merge-base`) and ORT engine resolution, conflict resolution across index stages (1, 2, 3) with zero artifact tolerance, LIFO stash stacking with worktree concurrency, and reflog disaster recovery. Generated `src/lib/data/lessonVisuals/git_vcs/day-15.json`.
  - **Item 6: Verification & Testing Suite:** All 5 tasks passed strict 6-cycle backtracking audits (16,269 total spoken words across Days 11–15, all 25 parts >= 615 words, all days >= 21.2 spoken min, Gate v2 workflow visual specs with SHA-256 bindings, deterministic POSIX bash execution). 50/50 tests passing in `tests/systems_long_lessons_parity.test.ts`. Full static TypeScript typecheck (`npx tsc --noEmit`) passing with 0 compilation errors. Single unified atomic commit pushed to `origin codex/interview-tab-reliability`.

"""
        pm_content = pm_content.replace(golden_rules_marker, golden_rules_marker + new_memory_entry)
        with open(pm_path, "w", encoding="utf-8") as f:
            f.write(pm_content)
        print("Updated PROJECT_MEMORY.md successfully!")
    else:
        print("PROJECT_MEMORY.md already updated or marker not found")

if __name__ == "__main__":
    update_memory()
