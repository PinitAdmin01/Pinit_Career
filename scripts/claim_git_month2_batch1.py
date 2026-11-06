import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

# 1. Append TASK-1222..1226 to agent_tasks.csv
tasks = [
    ('TASK-1222', 'git_vcs Day 31: Packfiles & Pack Indices: .pack and .idx Binary Layout, Fan-Out Tables & Delta Compression', 'AGENT-387', 'Course 20 git_vcs', 'In_Progress', '2026-10-17'),
    ('TASK-1223', 'git_vcs Day 32: The Git Index (.git/index) Binary Internals: DIRC Header, 40-Byte Stat Cache & Tree Cache Extension', 'AGENT-387', 'Course 20 git_vcs', 'In_Progress', '2026-10-17'),
    ('TASK-1224', 'git_vcs Day 33: Delta Compression & Object Deduplication: Sliding Window Algorithms, Max Delta Depth & Thin Packs', 'AGENT-387', 'Course 20 git_vcs', 'In_Progress', '2026-10-17'),
    ('TASK-1225', 'git_vcs Day 34: Garbage Collection, MIDX & Alternate Stores: git gc, git prune, Multi-Pack-Index & info/alternates', 'AGENT-387', 'Course 20 git_vcs', 'In_Progress', '2026-10-17'),
    ('TASK-1226', 'git_vcs Day 35: Milestone 4 (M2): ApexPlumbing Custom Git Object Database & Packfile Decoder Suite', 'AGENT-387', 'Course 20 git_vcs', 'In_Progress', '2026-10-17'),
]

with open(agent_tasks_path, "r", encoding="utf-8") as f:
    existing_tasks = f.read()

new_task_rows = []
for t_id, desc, agent, course, status, dt in tasks:
    if t_id not in existing_tasks:
        new_task_rows.append(f'{t_id},"{desc}",{agent},{course},{status},{dt}\n')

if new_task_rows:
    with open(agent_tasks_path, "a", encoding="utf-8") as f:
        f.writelines(new_task_rows)
    print(f"Appended {len(new_task_rows)} new tasks to agent_tasks.csv.")
else:
    print("Tasks already present in agent_tasks.csv.")

# 2. Append AGENT-387 to multi_agent_control.csv
with open(multi_agent_path, "r", encoding="utf-8") as f:
    existing_control = f.read()

agent_row = 'AGENT-387,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1222,In_Progress,2026-10-17 23:25:00,"5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 1 — Course 20 git_vcs Days 31-35: Packfiles & Indices, Git Index Binary Layout, Delta Compression, Garbage Collection/MIDX & ApexPlumbing Milestone 4 Capstone (TASK-1222..1226)."\n'

if "AGENT-387" not in existing_control:
    with open(multi_agent_path, "a", encoding="utf-8") as f:
        f.write(agent_row)
    print("Appended AGENT-387 to multi_agent_control.csv.")
else:
    print("AGENT-387 already present in multi_agent_control.csv.")
