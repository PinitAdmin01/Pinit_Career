import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

# 1. Append tasks to agent_tasks.csv
tasks = [
    ('TASK-1212', '"excel_viz Day 51: EuSpRIG Standards & Model Audit Methodology: Cell Dependency Mapping, Circularity Auditing & Trace Precedents"', 'AGENT-385', 'Course 21 excel_viz', 'In_Progress', '2026-10-17'),
    ('TASK-1213', '"excel_viz Day 52: Native Python in Excel (=PY()): Anaconda Runtime, Pandas DataFrames, Seaborn Visualizations & Cloud Sandbox Limits"', 'AGENT-385', 'Course 21 excel_viz', 'In_Progress', '2026-10-17'),
    ('TASK-1214', '"excel_viz Day 53: High-Density Executive Financial Dashboards: Sparklines, Bullet Graphs, Form Controls & Information Radiators"', 'AGENT-385', 'Course 21 excel_viz', 'In_Progress', '2026-10-17'),
    ('TASK-1215', '"excel_viz Day 54: Calculation Chain Internals & Performance Tuning: Volatile Functions, Multi-Threaded Calc & Binary Formats (.xlsb)"', 'AGENT-385', 'Course 21 excel_viz', 'In_Progress', '2026-10-17'),
    ('TASK-1216', '"excel_viz Day 55: Enterprise Spreadsheet Governance, Role-Based Access Control, IRM & Compliance Validation"', 'AGENT-385', 'Course 21 excel_viz', 'In_Progress', '2026-10-17'),
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    f.write("\n")
    for t in tasks:
        f.write(f"{t[0]},{t[1]},{t[2]},{t[3]},{t[4]},{t[5]}\n")

print("Claimed TASK-1212..1216 in agent_tasks.csv")

# 2. Append entry to multi_agent_control.csv
agent_row = 'AGENT-385,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1216,In_Progress,2026-10-17 22:25:00,"5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 5 — Course 21 excel_viz Days 51-55: EuSpRIG Auditing, Native Python in Excel (=PY()), Executive Dashboards, Calc Chain Internals & Enterprise Governance (TASK-1212..1216)."\n'

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write(agent_row)

print("Registered AGENT-385 as In_Progress in multi_agent_control.csv")
