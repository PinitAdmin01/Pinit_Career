import datetime

def claim():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

    # 1. Update multi_agent_control.csv
    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent412_found = False
    for line in ctrl_lines:
        if "AGENT-412" in line:
            updated_ctrl.append(
                f'AGENT-412,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1339,In_Progress,{now_str},'
                '"CLAIMED: Month 2 Pioneer Batch 6: Block 12 — Days 56-60 (Therac-25 & Knight Capital Disasters, Cross-Functional Technical Influence, Staff+ Communication Playbook, Career Capital & Grand Capstone: TASK-1339..1343). Target: Complete Course 22 to 60/60 Days (100% Complete)!"\n'
            )
            agent412_found = True
        else:
            updated_ctrl.append(line)

    if not agent412_found:
        updated_ctrl.append(
            f'AGENT-412,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1339,In_Progress,{now_str},'
            '"CLAIMED: Month 2 Pioneer Batch 6: Block 12 — Days 56-60 (Therac-25 & Knight Capital Disasters, Cross-Functional Technical Influence, Staff+ Communication Playbook, Career Capital & Grand Capstone: TASK-1339..1343). Target: Complete Course 22 to 60/60 Days (100% Complete)!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Claimed AGENT-412 in multi_agent_control.csv")

    # 2. Add pending tasks to agent_tasks.csv if not present
    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1339,{date_part},{time_part},IN_PROGRESS,Block 12 (M2 Batch 6),Antigravity,Course 22 soft_skills Day 56: Historic Communication Catastrophes 2: Therac-25 & Knight Capital,write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-56.json,IN_PROGRESS,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1340,{date_part},{time_part},PENDING,Block 12 (M2 Batch 6),Antigravity,Course 22 soft_skills Day 57: Cross-Functional Technical Influence: Product, Sales & Legal Alignment,write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-57.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1341,{date_part},{time_part},PENDING,Block 12 (M2 Batch 6),Antigravity,Course 22 soft_skills Day 58: The Staff+ Communication Playbook: Executive Summaries, 1-Pagers & Memos,write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-58.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1342,{date_part},{time_part},PENDING,Block 12 (M2 Batch 6),Antigravity,Course 22 soft_skills Day 59: Long-Term Career Capital: Reputation, Sponsorship & Becoming a Magnet,write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-59.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1343,{date_part},{time_part},PENDING,Block 12 (M2 Batch 6),Antigravity,Course 22 soft_skills Day 60: ⭐ MILESTONE 8: Grand Capstone — Master Technical Executive Dossier,write_to_file; run_command,src/lib/data/softSkillsLongLessons.ts; src/lib/data/lessonVisuals/soft-skills/day-60.json; tests/java_softskills_long_lessons.test.ts,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
    ]

    if "TASK-1339" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1339..1343 to agent_tasks.csv")

if __name__ == "__main__":
    claim()
