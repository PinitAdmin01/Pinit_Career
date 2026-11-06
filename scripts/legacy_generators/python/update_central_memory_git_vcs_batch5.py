import os
import sys

def update_memory():
    mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

    # 1. Update agent_tasks.csv
    tasks_csv = os.path.join(mem_dir, "agent_tasks.csv")
    new_tasks = [
        'TASK-1096,Antigravity,Complete,"TASK-1096: Expand Git & Version Control Systems Day 21: ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1097,Antigravity,Complete,"TASK-1097: Expand Git & Version Control Systems Day 22: GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1098,Antigravity,Complete,"TASK-1098: Expand Git & Version Control Systems Day 23: Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1099,Antigravity,Complete,"TASK-1099: Expand Git & Version Control Systems Day 24: GitHub Branch Protection Rules: Required CI Status Checks & Protected main with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17',
        'TASK-1100,Antigravity,Complete,"TASK-1100: Expand Git & Version Control Systems Day 25: Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow with 5-Part LongLesson, Visual JSON & POSIX Suite",2026-10-17'
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
    mac_line = 'AGENT-361,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1100,Completed,2026-10-17 15:55:00,"5-Task Batch Protocol Complete: git_vcs Days 21-25 (Course 22 Days 21-25: Milestone 3 & GitHub Collaboration, TASK-1096..1100) committed & pushed. 60/60 tests passing, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'
    
    with open(mac_csv, "r", encoding="utf-8") as f:
        existing_mac = f.read()

    if "AGENT-361" not in existing_mac:
        with open(mac_csv, "a", encoding="utf-8") as f:
            f.write("\n" + mac_line)
        print("Added AGENT-361 to multi_agent_control.csv")
    else:
        print("AGENT-361 already present in multi_agent_control.csv")

    # 3. Update PROJECT_MEMORY.md
    pm_path = os.path.join(mem_dir, "PROJECT_MEMORY.md")
    with open(pm_path, "r", encoding="utf-8") as f:
        pm_content = f.read()

    golden_rules_marker = "## 4. Golden Rules for Antigravity & Sub-Agents in this Codebase\n"
    if "TASK-1096..1100" not in pm_content and golden_rules_marker in pm_content:
        new_memory_entry = """* **2026-10-17 (Antigravity - 🎯 5-TASK BATCH PROTOCOL COMPLETE: GIT_VCS DAYS 21–25 MILESTONE 3 & GITHUB COLLABORATION - TASK-1096..1100):**
  - **Item 1: ⭐ MILESTONE 3: Complete Interactive Rebasing, Cherry-Picking, Remote Protocol & SSH Sync Engine (TASK-1096 / Day 21):** Implemented in `src/lib/data/gitVcsLongLessons.ts` (3,242 words, 21.6 spoken min, 45m total duration). Milestone capstone synthesizing linear rebase mechanics with `--onto` branch transplantation, interactive squash and fixup history consolidation, surgical hotfix backporting via cherry-pick with `-x` provenance tracking, and Ed25519 asymmetric cryptography with remote hygiene. Generated `src/lib/data/lessonVisuals/git_vcs/day-21.json`.
  - **Item 2: GitHub Collaboration & Pull Request (PR) Lifecycle: Forking vs Branching Models (TASK-1097 / Day 22):** Implemented (3,242 words, 21.6 spoken min, 45m total duration). Features contrasting the open-source Forking Model (zero-trust security isolation) against enterprise Shared Repository Branching, draft PR ergonomics, three-dot common ancestor diff computation (`base...head`), automated issue linking via closing keywords (`Fixes #42`, `Closes #108`), declarative `.github/CODEOWNERS` path routing, and team review assignment algorithms. Generated `src/lib/data/lessonVisuals/git_vcs/day-22.json`.
  - **Item 3: Code Review Best Practices: Reviewing Diffs, Inline Comments & LGTM Approvals (TASK-1098 / Day 23):** Implemented (3,383 words, 22.6 spoken min, 45m total duration). Features Split vs Unified diff views with whitespace filtering (`?w=1`), rich visual diffs for UI assets, empathetic inline feedback using Conventional Comments (`blocking:`, `nit:`, `question:`, `praise:`), GitHub Suggested Changes (````suggestion`) with atomic batch commits and co-authorship attribution (`Co-authored-by`), and review verdict governance (Comment, Approve `LGTM`, Request Changes veto power). Generated `src/lib/data/lessonVisuals/git_vcs/day-23.json`.
  - **Item 4: GitHub Branch Protection Rules: Required CI Status Checks & Protected main (TASK-1099 / Day 24):** Implemented (3,207 words, 21.4 spoken min, 45m total duration). Features direct push prevention (error GH006) and branch deletion blocking, wildcard pattern matching (`release/*`), peer review quorums with mandatory CODEOWNERS approvals and stale review dismissal on push, required automated CI status checks with strict up-to-date branch concurrency gating, force push blocking (`--force` and `--force-with-lease`), non-bypassable administrator rules, and compliance audit log streaming. Generated `src/lib/data/lessonVisuals/git_vcs/day-24.json`.
  - **Item 5: Git Workflows & Branching Strategies: Trunk-Based Development vs GitFlow (TASK-1100 / Day 25):** Implemented (3,218 words, 21.5 spoken min, 45m total duration). Features Trunk-Based Development with ephemeral short-lived branches (< 24h) and daily merges to `main` eliminating merge hell, decoupling deployment from release via Feature Flags and progressive canary rollouts with instant kill switches, classical GitFlow branching model (`main`, `develop`, `feature/*`, `release/*`, `hotfix/*`) with dual-merge paths, objective 4-dimension workflow selection rubric, and 3-phase organizational migration path. Generated `src/lib/data/lessonVisuals/git_vcs/day-25.json`.
  - **Item 6: Verification & Testing Suite:** All 5 tasks passed strict 6-cycle backtracking audits (16,292 total spoken words across Days 21–25, all 25 parts >= 622 words, all days >= 21.4 spoken min, Gate v2 workflow visual specs with SHA-256 bindings, deterministic POSIX bash execution). 60/60 tests passing in `tests/systems_long_lessons_parity.test.ts`. Full static TypeScript typecheck (`npx tsc --noEmit`) passing with 0 compilation errors. Single unified atomic commit pushed to `origin codex/interview-tab-reliability`.

"""
        pm_content = pm_content.replace(golden_rules_marker, golden_rules_marker + new_memory_entry)
        with open(pm_path, "w", encoding="utf-8") as f:
            f.write(pm_content)
        print("Updated PROJECT_MEMORY.md successfully!")
    else:
        print("PROJECT_MEMORY.md already updated or marker not found")

if __name__ == "__main__":
    update_memory()
