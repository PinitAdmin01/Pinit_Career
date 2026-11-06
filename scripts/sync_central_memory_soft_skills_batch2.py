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
        f'TASK-1319,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 22 soft_skills Day 36: Live Coding Communication: Thinking Out Loud Without Babbly Noise (Dual-Task Execution / Babbly Noise Filter / Test-Driven Verbalization / LRU Cache Lab),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-36.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1320,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 22 soft_skills Day 37: Debugging Under Pressure in Interviews: Methodical Hypothesis Testing (Popperian Falsification / Dry-Run Trace Table Blueprint / 4-Minute Concurrency Triage),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-37.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1321,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 22 soft_skills Day 38: The Staff Engineer Archetypes: Tailoring Communication Across Personas (Tech Lead / Architect / Solver / Right Hand & 50/20/15/15 Operating Rhythm),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-38.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1322,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 22 soft_skills Day 39: Building Coalitions & Grassroots Engineering Initiatives: Bottom-Up Adoption (Rogers Innovation Diffusion / Lighthouse Playbook / Skeptic Conversion),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-39.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1323,{date_part},{time_part},COMPLETED,Block 8 (M2 Batch 2),Antigravity,Course 22 soft_skills Day 40: Milestone 5 (M2): ApexInfluence Grassroots Engineering Coalition & Tech Strategy Suite (Political Economy Statecraft / Public Revolt Mediation / Principal Staff L7 Accreditation - 100% COMPLETE),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-40.json; tests/java_softskills_long_lessons.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1319" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1319..1323 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent408_found = False
    for line in ctrl_lines:
        if "AGENT-408" in line:
            updated_ctrl.append(
                f'AGENT-408,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1319,Completed,{now_str},'
                '"BATCH COMPLETE: Month 2 Pioneer Batch 2: Block 8 — Days 36-40 (Live Coding Communication, Scientific Debugging, Staff Archetypes, Grassroots Coalitions, Milestone 5 ApexInfluence Suite: TASK-1319..1323) complete and tested. 19,251 words (all 5 days >= 31.3 spoken min, avg 32.1 min/day), 103/103 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 40/60 Days (66.7% Complete)!"\n'
            )
            agent408_found = True
        else:
            updated_ctrl.append(line)

    if not agent408_found:
        updated_ctrl.append(
            f'AGENT-408,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1319,Completed,{now_str},'
            '"BATCH COMPLETE: Month 2 Pioneer Batch 2: Block 8 — Days 36-40 (Live Coding Communication, Scientific Debugging, Staff Archetypes, Grassroots Coalitions, Milestone 5 ApexInfluence Suite: TASK-1319..1323) complete and tested. 19,251 words (all 5 days >= 31.3 spoken min, avg 32.1 min/day), 103/103 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 40/60 Days (66.7% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Updated AGENT-408 in multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 22 (`soft_skills`) Month 2 Batch 2 (Days 36–40: Block 8 — Staff+ Influence, Archetypes & Milestone 5 ApexInfluence) ({now_str})
- **Agent**: `AGENT-408` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1319` through `TASK-1323`
- **Scope**:
  - **Day 36 (`TASK-1319`)**: Live Coding Communication: Thinking Out Loud Without Babbly Noise (Dual-Task Phonological Loop Isolation, Babbly Noise Filter, TDD Pre-Execution Assertions, LRU Cache Sentinel Invariants, 3,772 words, 31.4 spoken min).
  - **Day 37 (`TASK-1320`)**: Debugging Under Pressure in Interviews: Methodical Hypothesis Testing (Popperian Falsification, 3-Row Dry-Run Trace Table Blueprint, 5-Second Hands-Off Rule, 4-Minute Lock-Free Concurrency Triage, 3,757 words, 31.3 spoken min).
  - **Day 38 (`TASK-1321`)**: The Staff Engineer Archetypes: Tailoring Communication Across Personas (Will Larson's 4 Personas, Context-Driven Diagnosis, 50/20/15/15 Operating Rhythm, Multi-Archetype Executive Chameleon Lab, 4,002 words, 33.4 spoken min).
  - **Day 39 (`TASK-1322`)**: Building Coalitions & Grassroots Engineering Initiatives: Bottom-Up Adoption (Rogers' Diffusion 16% Tipping Point, Lighthouse Team 80% Codemod Playbook, Real-Time CI Telemetry, Skeptic Conversion with Radical Empathy, 3,864 words, 32.2 spoken min).
  - **Day 40 (`TASK-1323`)**: Milestone 5 (M2): ApexInfluence Grassroots Engineering Coalition & Tech Strategy Suite (Political Economy Positive-Sum Statecraft, 4-Tier Zero-Trust Mesh Dossier, 310/350 Services Converted, Public Slack Mutiny Mediation, Elena Rostova Principal Staff L7 Accreditation, 3,856 words, 32.1 spoken min).
- **Curriculum Totals**:
  - Batch Words: **19,251 words** across Days 36–40 (average **3,850 words/day**, **32.1 spoken min/day**).
  - Visual Suites: `src/lib/data/lessonVisuals/soft-skills/day-{{36..40}}.json` with valid workflow template specs & SHA-256 code hashes.
  - Test Suite: `tests/java_softskills_long_lessons.test.ts` passing 103/103 tests (100%), 0 tsc errors.
  - Overall Course 22 Progress: **40 / 60 Days (66.7%)** complete.
"""

    with open(memory_path, "a", encoding="utf-8") as f:
        f.write(mem_entry)
    print("Appended milestone record to PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
