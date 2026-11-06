import os, csv, datetime

MEMORY_DIR = r"C:\Users\Admin\Desktop\projects\memory of agent"
TIMESTAMP = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Register AGENT-466 in multi_agent_control.csv
mac_path = os.path.join(MEMORY_DIR, "multi_agent_control.csv")
with open(mac_path, 'r', encoding='utf-8') as f:
    rows = list(csv.reader(f))

new_agent_row = [
    "AGENT-466",
    "Antigravity",
    "codex/interview-tab-reliability",
    "Present-Career-os",
    "TASK-1669..1673",
    "In_Progress",
    "Active",
    "Course 02 (react-basics) Month 2 Block 12 (Days 56-60): Industrial Case Studies, Principal React Architect RFC & Grand Master Capstone Gate - FINAL 100% COMPLETION",
    TIMESTAMP,
    "",
    ""
]

rows.append(new_agent_row)

with open(mac_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("Registered AGENT-466 in multi_agent_control.csv")

# 2. Register TASK-1669..1673 in agent_tasks.csv
tasks_path = os.path.join(MEMORY_DIR, "agent_tasks.csv")
with open(tasks_path, 'r', encoding='utf-8') as f:
    task_rows = list(csv.reader(f))

block12_tasks = [
    ("TASK-1669", "Day 56: Industrial Architecture Case Study 1: High-Frequency Trading Desk & Financial Telemetry"),
    ("TASK-1670", "Day 57: Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & PPR"),
    ("TASK-1671", "Day 58: Industrial Architecture Case Study 3: Enterprise Collaborative Workspace & Server-Driven UI"),
    ("TASK-1672", "Day 59: Principal Full-Stack React Architect RFC & System Design Defense"),
    ("TASK-1673", "Day 60: 🏆 Grand Master Capstone & Production Deployment Gate: HyperGrid Enterprise Portal")
]

for tid, desc in block12_tasks:
    task_rows.append([
        tid,
        TIMESTAMP[:10],
        TIMESTAMP[11:],
        "IN_PROGRESS",
        "IN_PROGRESS",
        "Antigravity IDE",
        f"Course 02 Month 2 {desc}",
        "Python/Node/TSX",
        "reactLongLessons.ts, react30DayData.ts, day-56..60.json",
        "Block 12 final 60/60 days completion for Course 02",
        "c7b35c15-f056-4dc6-888b-f56621a809c1",
        ""
    ])

with open(tasks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(task_rows)

print("Registered TASK-1669..1673 in agent_tasks.csv")
