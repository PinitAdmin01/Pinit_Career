import os
import sys

def update_memory():
    mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

    # 1. Update agent_tasks.csv
    tasks_csv = os.path.join(mem_dir, "agent_tasks.csv")
    new_tasks = [
        'TASK-1091,Antigravity,Complete,"TASK-1091: Expand Git & Version Control Systems Day 16: Rebase vs Merge Architecture: Linear History Mechanics & The Golden Rule of Rebasing with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1092,Antigravity,Complete,"TASK-1092: Expand Git & Version Control Systems Day 17: Interactive Rebasing (git rebase -i): Squashing, Rewording, Dropping & Fixups with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1093,Antigravity,Complete,"TASK-1093: Expand Git & Version Control Systems Day 18: Cherry-Picking & Selective Patching: git cherry-pick <sha> & Hotfixes with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1094,Antigravity,Complete,"TASK-1094: Expand Git & Version Control Systems Day 19: Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1095,Antigravity,Complete,"TASK-1095: Expand Git & Version Control Systems Day 20: Remote Synchronization Workflow: git fetch, git pull --rebase & Upstream Tracking with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17'
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
    mac_line = 'AGENT-360,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1095,Completed,2026-10-17 15:10:00,"5-Task Batch Protocol Complete: git_vcs Days 16-20 (Course 22 Days 16-20: Linear History & Remote Sync, TASK-1091..1095) committed & pushed. 55/55 tests passing, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'
    
    with open(mac_csv, "r", encoding="utf-8") as f:
        existing_mac = f.read()

    if "AGENT-360" not in existing_mac:
        with open(mac_csv, "a", encoding="utf-8") as f:
            f.write("\n" + mac_line)
        print("Added AGENT-360 to multi_agent_control.csv")
    else:
        print("AGENT-360 already present in multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    pm_path = os.path.join(mem_dir, "PROJECT_MEMORY.md")
    with open(pm_path, "r", encoding="utf-8") as f:
        pm_content = f.read()

    golden_rules_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
    if "TASK-1091..1095" not in pm_content and golden_rules_marker in pm_content:
        new_memory_entry = """* **2026-10-17 (Antigravity - 🎯 5-TASK BATCH PROTOCOL COMPLETE: GIT_VCS DAYS 16–20 LINEAR HISTORY & REMOTE SYNC - TASK-1091..1095):**
  - **Item 1: Rebase vs Merge Architecture: Linear History Mechanics & The Golden Rule of Rebasing (TASK-1091 / Day 16):** Implemented in `src/lib/data/gitVcsLongLessons.ts` (3,513 words, 23.4 spoken min, 45m total duration). Features commit unplugging and sequential replay onto target base tips, rebase vs merge chronological tradeoffs, mathematical analysis of the Golden Rule of Rebasing (prohibiting history rewriting on shared public branches), mid-rebase conflict resolution across unmerged stages, sequencer continuation (`git rebase --continue`), and fail-safe rollback (`git rebase --abort`). Generated `src/lib/data/lessonVisuals/git_vcs/day-16.json`.
  - **Item 2: Interactive Rebasing (`git rebase -i`): Squashing, Rewording, Dropping & Fixups (TASK-1092 / Day 17):** Implemented (3,356 words, 22.4 spoken min, 45m total duration). Features interactive rebase todo sheet grammar, commit squashing (`squash` / `s`) and message discarding (`fixup` / `f`), message amending (`reword` / `r`), historical commit elimination (`drop` / `d`), surgical commit splitting with `edit` (e), automated continuous build verification gates via `exec` (x), and enterprise commit history curation prior to peer review. Generated `src/lib/data/lessonVisuals/git_vcs/day-17.json`.
  - **Item 3: Cherry-Picking & Selective Patching: `git cherry-pick <sha>` & Hotfixes (TASK-1093 / Day 18):** Implemented (3,214 words, 21.4 spoken min, 45m total duration). Features isolated commit patch extraction and replay on release branches, production hotfix backporting across release maintenance lines without merge contamination, automated provenance tracking with `-x` (`(cherry picked from commit <sha>)`), multi-commit range cherry-picking (`A..B` vs `A^..B`), uncommitted staging with `-n` (`--no-commit`), and cherry-pick conflict resolution and abortion. Generated `src/lib/data/lessonVisuals/git_vcs/day-18.json`.
  - **Item 4: Remote Repositories & Protocol Mechanics: HTTPS, SSH Keys & Remote Management (TASK-1094 / Day 19):** Implemented (3,153 words, 21.0 spoken min, 45m total duration). Features `.git/config` remote configuration and refspec mapping engine (`+refs/heads/*:refs/remotes/origin/*`), isolated read-only remote-tracking namespace (`refs/remotes/origin/*`), HTTPS token authentication vs Ed25519 elliptic-curve asymmetric cryptography, multi-remote triangle orchestration (fork `origin` vs canonical `upstream`), and automated tracking reference hygiene (`git remote prune` & `fetch.prune true`). Generated `src/lib/data/lessonVisuals/git_vcs/day-19.json`.
  - **Item 5: Remote Synchronization Workflow: `git fetch`, `git pull --rebase` & Upstream Tracking (TASK-1095 / Day 20):** Implemented (3,274 words, 21.8 spoken min, 45m total duration). Features non-destructive `git fetch` packfile download and object transport, upstream branch tracking bindings (`git branch -u`, `branch.<name>.remote` & `merge`), ahead/behind divergence computation (`git branch -vv`), pathology of raw `git pull` merge bubbles and Foxtrot mainline inversion, linear synchronization via `git pull --rebase`, and seamless dirty worktree protection via `--autostash`. Generated `src/lib/data/lessonVisuals/git_vcs/day-20.json`.
  - **Item 6: Verification & Testing Suite:** All 5 tasks passed strict 6-cycle backtracking audits (16,510 total spoken words across Days 16–20, all 25 parts >= 615 words, all days >= 21.0 spoken min, Gate v2 workflow visual specs with SHA-256 bindings, deterministic POSIX bash execution). 55/55 tests passing in `tests/systems_long_lessons_parity.test.ts`. Full static TypeScript typecheck (`npx tsc --noEmit`) passing with 0 compilation errors. Single unified atomic commit pushed to `origin codex/interview-tab-reliability`.

"""
        pm_content = pm_content.replace(golden_rules_marker, golden_rules_marker + new_memory_entry)
        with open(pm_path, "w", encoding="utf-8") as f:
            f.write(pm_content)
        print("Updated PROJECT_MEMORY.md successfully!")
    else:
        print("PROJECT_MEMORY.md already updated or marker not found")

if __name__ == "__main__":
    update_memory()
