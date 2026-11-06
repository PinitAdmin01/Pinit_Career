# scripts/claim_month2_batch2.py
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"

# 1. agent_tasks.csv
tasks_csv = os.path.join(memory_dir, "agent_tasks.csv")
with open(tasks_csv, "r", encoding="utf-8") as f:
    content = f.read()

new_tasks = [
    'TASK-1182,Antigravity,In_Progress,"TASK-1182: Expand Excel & Data Analysis Day 36: Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding Optimization (Month 2 Batch 2)",2026-10-17\n',
    'TASK-1183,Antigravity,In_Progress,"TASK-1183: Expand Excel & Data Analysis Day 37: Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Active vs Inactive Relationships",2026-10-17\n',
    'TASK-1184,Antigravity,In_Progress,"TASK-1184: Expand Excel & Data Analysis Day 38: Introduction to DAX: Calculated Columns vs Measures, Filter Context & Row Context",2026-10-17\n',
    'TASK-1185,Antigravity,In_Progress,"TASK-1185: Expand Excel & Data Analysis Day 39: Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables",2026-10-17\n',
    'TASK-1186,Antigravity,In_Progress,"TASK-1186: Expand Excel & Data Analysis Day 40: ⭐ MILESTONE 5: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite",2026-10-17\n'
]

if "TASK-1182" not in content:
    with open(tasks_csv, "a", encoding="utf-8") as f:
        f.writelines(new_tasks)
    print("Appended TASK-1182..1186 to agent_tasks.csv")
else:
    print("TASK-1182 already in agent_tasks.csv")

# 2. multi_agent_control.csv
mac_csv = os.path.join(memory_dir, "multi_agent_control.csv")
with open(mac_csv, "r", encoding="utf-8") as f:
    mac_content = f.read()

agent_entry = 'AGENT-379,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1186,In_Progress,2026-10-17 20:45:00,"5-Task Batch Protocol In Progress: Course 21 excel_viz Month 2 Batch 2 Days 36-40 & Milestone 5: Power Query M Internals, Star Schema Modeling, DAX Contexts, Time Intelligence & ApexModel Engine Suite (TASK-1182..1186)."\n'

if "AGENT-379" not in mac_content:
    with open(mac_csv, "a", encoding="utf-8") as f:
        f.write(agent_entry)
    print("Appended AGENT-379 to multi_agent_control.csv")
else:
    print("AGENT-379 already in multi_agent_control.csv")
