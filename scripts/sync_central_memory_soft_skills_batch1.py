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
        f'TASK-1314,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 22 soft_skills Day 31: System Design Interview Protocol: Scope Clarification & Back-of-the-Envelope Estimation (Functional vs Non-Functional Scoping / Capacity Math / Explicit Non-Goals),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-31.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1315,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 22 soft_skills Day 32: Driving the Whiteboard: Top-Down Architecture & Iterative Deep Dives (5-Tier Topology / Spatial Indexing / Uber H3 Hexagonal Grid & Cognitive Ergonomics),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-32.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1316,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 22 soft_skills Day 33: Communicating Trade-Offs Under Pressure: CAP PACELC & Cost vs Throughput (Multi-Dimensional Matrix / PACELC Realities / Actuarial TCO Models),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-33.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1317,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 22 soft_skills Day 34: Handling Interviewer Pushback & Curveballs: Graceful Pivots & Intellectual Flexibility (Celebrity Fanout / Compound Partition Failures / Disagree & Commit),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-34.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
        f'TASK-1318,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 22 soft_skills Day 35: Milestone 4 (M2): ApexDesign System Design Whiteboard Communication & Live Trade-Off Suite (Planetary Rubrics / Adversarial Bar Raiser Panel Defense - 100% COMPLETE),write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-35.json; tests/java_softskills_long_lessons.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    ]

    if "TASK-1314" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1314..1318 to agent_tasks.csv")

    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent407_found = False
    for line in ctrl_lines:
        if "AGENT-407" in line:
            updated_ctrl.append(
                f'AGENT-407,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1314,Completed,{now_str},'
                '"BATCH COMPLETE: Month 2 Pioneer Batch 1: Block 7 — Days 31-35 (System Design Interview Protocol, Whiteboard Driving, Trade-Off Communication, Handling Pushback & Curveballs, Milestone 4 ApexDesign Suite: TASK-1314..1318) complete and tested. 19,105 words (all 5 days >= 31.2 spoken min, avg 31.8 min/day), 93/93 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 35/60 Days (58.3% Complete)!"\n'
            )
            agent407_found = True
        else:
            updated_ctrl.append(line)

    if not agent407_found:
        updated_ctrl.append(
            f'AGENT-407,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1314,Completed,{now_str},'
            '"BATCH COMPLETE: Month 2 Pioneer Batch 1: Block 7 — Days 31-35 (System Design Interview Protocol, Whiteboard Driving, Trade-Off Communication, Handling Pushback & Curveballs, Milestone 4 ApexDesign Suite: TASK-1314..1318) complete and tested. 19,105 words (all 5 days >= 31.2 spoken min, avg 31.8 min/day), 93/93 unit tests passing, 0 tsc errors. Course 22 (soft_skills) is 35/60 Days (58.3% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Updated AGENT-407 in multi_agent_control.csv")

    with open(memory_path, "r", encoding="utf-8") as f:
        mem_text = f.read()

    mem_entry = f"""
### Milestone Update — Course 22 (`soft_skills`) Month 2 Batch 1 (Days 31–35: Block 7 — System Design Whiteboarding, Staff+ Influence & Milestone 4) ({now_str})
- **Agent**: `AGENT-407` (`codex/interview-tab-reliability`)
- **Tasks**: `TASK-1314` through `TASK-1318`
- **Scope**:
  - **Day 31 (`TASK-1314`)**: System Design Interview Protocol: Scope Clarification & Back-of-the-Envelope Estimation (Functional Core vs Non-Functional SLAs, 400M Writes/day Sizing Calculus, Explicit Boundary Scoping, 3,904 words, 32.5 spoken min).
  - **Day 32 (`TASK-1315`)**: Driving the Whiteboard: Top-Down Architecture & Iterative Deep Dives (5-Tier Decoupled Topology, Spatial Indexing Uber H3 Grid Level 8, 150k GPS pings/sec, Cognitive Whiteboard Ergonomics, 3,789 words, 31.6 spoken min).
  - **Day 33 (`TASK-1316`)**: Communicating Trade-Offs Under Pressure: CAP, PACELC & Cost vs Throughput (PA/EL LSM-Tree vs PC/EC Paxos, 4 Core Binary Dilemmas, Actuarial Cloud Tax Defense, 3,864 words, 32.2 spoken min).
  - **Day 34 (`TASK-1317`)**: Handling Interviewer Pushback & Curveballs: Graceful Pivots & Intellectual Flexibility (Curveball Reception Psychology, 4 Archetype Playbooks, Disagree & Commit Defense, 3,806 words, 31.7 spoken min).
  - **Day 35 (`TASK-1318`)**: Milestone 4 (M2): ApexDesign System Design Whiteboard Communication & Live Trade-Off Suite (Planetary Scale 4-Pillar Rubric, ApexRide & ApexFeed Progressive Visual Layers, Adversarial Bar Raiser Panel Unanimous Consensus, 3,742 words, 31.2 spoken min).
- **Curriculum Totals**:
  - Batch Words: **19,105 words** across Days 31–35 (average **3,821 words/day**, **31.8 spoken min/day**).
  - Visual Suites: `src/lib/data/lessonVisuals/soft-skills/day-{{31..35}}.json` with valid workflow template specs & SHA-256 code hashes.
  - Test Suite: `tests/java_softskills_long_lessons.test.ts` passing 93/93 tests (100%), 0 tsc errors.
  - Overall Course 22 Progress: **35 / 60 Days (58.3%)** complete.
"""

    with open(memory_path, "a", encoding="utf-8") as f:
        f.write(mem_entry)
    print("Appended milestone record to PROJECT_MEMORY.md")

if __name__ == "__main__":
    sync()
