import datetime

def sync():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    memory_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1334,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 22 soft_skills Day 51: Public Speaking & Tech Conferences: CFP Writing & Engaging Technical Audiences (KubeCon/Strange Loop CFP Rubric / 4-Act Technical Narrative / Presentation Risk Hardening / Live Projector Failure Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-51.json,COMPLETED,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1335,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 22 soft_skills Day 52: Technical Writing for Publication: Engineering Blogs & Thought Leadership (Hacker News Ranking Mechanics / 4-Act Mystery Blog / Multi-Platform Canonical Publishing / HN Comment Section Defense Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-52.json,COMPLETED,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1336,{date_part},{time_part},COMPLETED,Block 11 (M2 Batch 5),Antigravity,Course 22 soft_skills Day 53: Remote & Distributed Team Communication: Asynchronous Sovereignty & Global Presence (GitLab Handbook-First SSOT / 120-Second Video Architecture Walkthrough / Follow-the-Sun Tokyo-Berlin-SF Handover / Zero-Overlap Crisis Patching Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-53.json,COMPLETED,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1337,{date_part},{time_part},COMPLETED,Block 12 (M2 Batch 5),Antigravity,Course 22 soft_skills Day 54: The Complete Staff+ Interview Gauntlet: Structuring End-to-End Preparation (Bayesian Round Independence & Hiring Committee Rubric / 14-Day Structured Preparation Plan / Full-Loop Performance Tracker CLI / 5-Round Onsite Stamina Preservation Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-54.json,COMPLETED,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1338,{date_part},{time_part},COMPLETED,Block 12 (M2 Batch 5),Antigravity,Course 22 soft_skills Day 55: Historic Communication Catastrophes 1: The Space Shuttle Challenger O-Ring Disaster (Edward Tufte Forensic Flaw Analysis / Reconstructed 1-Page Scatterplot Proof / Critical Threat Visualizer CLI / High-Pressure Launch Safety Defense Lab - 100% COMPLETE),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-55.json; tests/java_softskills_long_lessons.test.ts,COMPLETED,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
    ]

    if "TASK-1334" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1334..1338 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent411_found = False
    for line in ctrl_lines:
        if "AGENT-411" in line:
            updated_ctrl.append(
                f'AGENT-411,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1334,Completed,{now_str},'
                '"BATCH COMPLETE: Month 2 Pioneer Batch 5: Blocks 11-12 — Days 51-55 (Public Speaking & CFP Writing, Technical Writing & Hacker News Virality, Remote Async Sovereignty, Staff+ Interview Gauntlet, and Challenger O-Ring Forensic Communication: TASK-1334..1338) complete and tested. 18,154 words (all 5 days >= 29.4 spoken min, avg 30.3 min/day), 133/133 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 55/60 Days (91.7% Complete)!"\n'
            )
            agent411_found = True
        else:
            updated_ctrl.append(line)

    if not agent411_found:
        updated_ctrl.append(
            f'AGENT-411,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1334,Completed,{now_str},'
            '"BATCH COMPLETE: Month 2 Pioneer Batch 5: Blocks 11-12 — Days 51-55 (Public Speaking & CFP Writing, Technical Writing & Hacker News Virality, Remote Async Sovereignty, Staff+ Interview Gauntlet, and Challenger O-Ring Forensic Communication: TASK-1334..1338) complete and tested. 18,154 words (all 5 days >= 29.4 spoken min, avg 30.3 min/day), 133/133 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 55/60 Days (91.7% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Updated AGENT-411 in multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 22 (`soft_skills`) Month 2 Batch 5 (Days 51–55: Blocks 11 & 12 — Public Speaking, Technical Writing, Remote Async Sovereignty, Staff+ Gauntlet & Challenger Forensics) ({now_str})
- **Agent**: `AGENT-411` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1334` through `TASK-1338`
- **Scope**:
  - **Day 51 (`TASK-1334`)**: *Public Speaking & Tech Conferences: CFP Writing & Engaging Technical Audiences* (3,636 words, 30.3 spoken min). KubeCon/Strange Loop CFP scoring matrix (novelty, applicability, actionable takeaway), 4-act presentation outline blueprint with live terminal pacing, offline containerized demo hardening, and live keynote projector failure lab maintaining executive composure.
  - **Day 52 (`TASK-1335`)**: *Technical Writing for Publication: Engineering Blogs & Thought Leadership* (3,687 words, 30.7 spoken min). Hacker News front-page gravity decay ranking algorithm, 4-act detective mystery blog post blueprint (with CPU flame graphs & Linux sysctl diagnostics), multi-platform canonical publishing pipeline, and live HN comment section defense de-escalating skepticism with peer-reviewed empirical evidence.
  - **Day 53 (`TASK-1336`)**: *Remote & Distributed Team Communication: Asynchronous Sovereignty & Global Presence* (3,524 words, 29.4 spoken min). GitLab Handbook-First SSOT communication doctrine, 120-second high-bandwidth Loom video architecture walkthrough, Follow-the-Sun relay schedule across Tokyo/Berlin/SF, and zero-overlap crisis resolution lab maintaining uninterrupted production velocity.
  - **Day 54 (`TASK-1337`)**: *The Complete Staff+ Interview Gauntlet: Structuring End-to-End Preparation* (3,664 words, 30.5 spoken min). Bayesian conditional independence across interview loops and Google/Meta hiring committee packet scoring, 14-day phased study plan with 24-hour taper, automated full-loop performance tracker CLI, and 5-round mock onsite gauntlet lab simulating sustained high-stakes stamina.
  - **Day 55 (`TASK-1338`)**: *Historic Communication Catastrophes 1: The Space Shuttle Challenger O-Ring Disaster* (3,643 words, 30.4 spoken min). Edward Tufte's forensic deconstruction of Thiokol's 13 faxed charts (anti-patterns: omitting 17 zero-incident flights, arbitrary ordering, chartjunk), reconstructed definitive 1-page scatterplot proving exponential blowout probability at 29°F, automated Critical Threat Visualizer CLI, and high-pressure launch safety defense lab demanding an unequivocal NO-GO decision.
- **Verification & Invariants**:
  - **18,154 total words** authored across Days 51–55 (average **3,631 words/day**, all 25 parts strictly $\ge 580$ words).
  - All 25 TypeScript code snippets executed via `npx tsx` and captured into `scripts/soft_skills_days51_55_outputs.json`.
  - Gate v2 visual JSON specs created at `src/lib/data/lessonVisuals/soft-skills/day-{{51..55}}.json` with matching SHA-256 `codeHash` bindings.
  - **133 / 133 unit tests passing (100%)** via `npx tsx --test tests/java_softskills_long_lessons.test.ts`.
  - `npx tsc --noEmit` exits with **0 errors**.
  - Course 22 (`soft_skills`) advances from 50/60 Days (83.3%) to **55 / 60 Days (91.7% Complete)** (275 / 300 parts complete).
- **Git Commit**: `6763dd6f` (*feat(curriculum): complete Course 22 (soft_skills) Month 2 Batch 5 (Days 51-55: Blocks 11-12, TASK-1334..1338)*) pushed to origin `codex/interview-tab-reliability`.
"""

    with open(memory_path, "w", encoding="utf-8") as f:
        f.write(mem_entry.strip() + "\n\n" + mem_text)
    print("Appended milestone record to PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
