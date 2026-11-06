import os
import sys

# 1. Update agent_tasks.csv
tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_csv, "r", encoding="utf-8", errors="replace") as f:
    t_content = f.read()

for t in range(1121, 1126):
    old_s = f'TASK-{t},Antigravity,In_Progress,"TASK-{t}: Expand Workplace Soft Skills'
    new_s = f'TASK-{t},Antigravity,Complete,"TASK-{t}: Expand Workplace Soft Skills'
    if old_s in t_content:
        t_content = t_content.replace(old_s, new_s)
        print(f"agent_tasks.csv: Updated TASK-{t} to Complete")
    else:
        print(f"agent_tasks.csv: Could not find {old_s}")

with open(tasks_csv, "w", encoding="utf-8") as f:
    f.write(t_content)

# 2. Update multi_agent_control.csv
control_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_csv, "r", encoding="utf-8", errors="replace") as f:
    c_content = f.read()

old_agent = 'AGENT-365,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1125,In_Progress,2026-10-17 16:42:00,"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 6-10 (Cross-Functional Alignment, SBI Feedback, Conflict Resolution, 90-Sec Standups, Minto Pyramid, TASK-1121..1125)."'
new_agent = 'AGENT-365,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1125,Completed,2026-10-17 17:15:00,"5-Task Batch Protocol Complete: Course 24 soft_skills Days 6-10 (Cross-Functional Alignment, SBI Feedback, Conflict Resolution, 90-Sec Standups, Minto Pyramid, TASK-1121..1125) committed & pushed. 20,287 spoken words (all 5 days >= 22.6 spoken min), 43/43 tests passing in java_softskills_long_lessons.test.ts, 0 tsc errors, Gate v2 workflow visual specs with SHA-256 bindings."'

if old_agent in c_content:
    c_content = c_content.replace(old_agent, new_agent)
    print("multi_agent_control.csv: Updated AGENT-365 to Completed")
else:
    # If not found exact string, let's search by AGENT-365
    import re
    c_content = re.sub(
        r'AGENT-365,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1125,In_Progress,[^\n]+',
        new_agent,
        c_content
    )
    print("multi_agent_control.csv: Updated AGENT-365 using regex")

with open(control_csv, "w", encoding="utf-8") as f:
    f.write(c_content)

# 3. Prepend PROJECT_MEMORY.md
project_memory = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(project_memory, "r", encoding="utf-8", errors="replace") as f:
    pm_content = f.read()

log_entry = """* **2026-10-17 (Antigravity - 🏆 COURSE 24 BATCH 1 COMPLETE: WORKPLACE SOFT SKILLS DAYS 6-10 (CROSS-FUNCTIONAL, SBI FEEDBACK, CONFLICT, STANDUPS, MINTO PYRAMID) - TASK-1121..1125):**
  - **Milestone Achievement:** Expanded Course 24 (Workplace Soft Skills / `soft_skills` / `soft-skills`) Days 6–10 on branch `codex/interview-tab-reliability` (in `src/lib/data/softSkillsLongLessons.ts` and `src/lib/data/lessonVisuals/soft-skills/day-06.json` through `day-10.json`).
  - **Batch 1 Expansion Summary (Days 6–10: 20,287 spoken words, all 5 days >= 22.6 spoken min @ 150 wpm, average 27.0 min/day):**
    - **Item 1: Cross-Functional Alignment & Non-Technical Translation: The ELI5 Framework (TASK-1121 / Day 6):** (3,568 words, ~23.8m spoken). Overcoming the Curse of Knowledge, Jargon Density & Cognitive Friction Analyzer, physical-world ELI5 analogies, translating engineering refactors into executive business metrics (revenue recovery, cloud spend, churn), Iron Triangle trade-off negotiation, and master alignment certification. Generated `day-06.json`.
    - **Item 2: Constructive Feedback & Code Review Psychology: The SBI Feedback Framework (TASK-1122 / Day 7):** (3,393 words, ~22.6m spoken). Code review psychology, eliminating accusatory 'You' statements, Situation-Behavior-Impact (SBI) feedback model, Conventional Comments prefix standardization (`[blocking]`, `[nit]`, `[suggestion]`, `[question]`), 3-Comment review circuit breaker, Disagree and Commit, and high-trust engineering culture certification. Generated `day-07.json`.
    - **Item 3: Conflict Resolution & De-escalation in Tech Teams: The IBR Approach (TASK-1123 / Day 8):** (4,630 words, ~30.9m spoken). Cognitive debate vs affective interpersonal friction, Interest-Based Relational (IBR) mediation framework, decoupling people from technical problems, Position-to-Interest mapping, Multi-Criteria Weighted Pugh Decision Matrix for Architecture Decision Records (ADRs), and master technical consensus certification. Generated `day-08.json`.
    - **Item 4: Effective Agile Standups & Synchronous Meetings: The 90-Second Update (TASK-1124 / Day 9):** (4,220 words, ~28.1m spoken). Maker's Schedule vs Manager's Schedule, 23-minute focus recovery latency, loaded meeting payroll economics, the 90-Second Standup Protocol (Yesterday's Outcome, Today's Commitment, Active Blockers), the Parking Lot Pattern for deep dives (> 60s or < 50% relevance), Right-to-Left Kanban board walking ('Stop Starting, Start Finishing'), and Agile Meeting Velocity certification. Generated `day-09.json`.
    - **Item 5: Technical Presentations & Slide Deck Architecture: The Minto Pyramid Principle (TASK-1125 / Day 10):** (4,476 words, ~29.8m spoken). Top-Down executive communication vs Bottom-Up data dumping (BLUF on Slide 1), Barbara Minto's Pyramid Principle (Governing Thought apex, MECE inductive pillars), the SCQA Narrative Arc (Situation, Complication, Question, Answer), high-signal slide design with 1-idea-per-slide and declarative Headline Assertions, cognitive dual-coding, and executive Q&A appendix architecture. Generated `day-10.json`.
  - **Deterministic TypeScript Test Suite Verification:** All 43 tests pass in `tests/java_softskills_long_lessons.test.ts` (0 failures, 100% pass rate).
  - **Static Typecheck:** Zero TypeScript compilation errors (`npx tsc --noEmit` exited 0).
  - **Gate v2 Visual JSON Validation:** All visual files `src/lib/data/lessonVisuals/soft-skills/day-06.json` through `day-10.json` generated with matching SHA-256 `codeHash` bindings for all 25 parts.

"""

pm_content = log_entry + pm_content
with open(project_memory, "w", encoding="utf-8") as f:
    f.write(pm_content)
print("PROJECT_MEMORY.md: Successfully prepended milestone log entry!")
