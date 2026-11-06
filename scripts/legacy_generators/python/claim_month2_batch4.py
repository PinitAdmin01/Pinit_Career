# scripts/claim_month2_batch4.py
import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

new_tasks = [
    'TASK-1202,"excel_viz Day 46: VBA Architecture & COM Object Model: Application, Workbook, Worksheet & Range DOM Hierarchy",AGENT-383,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1203,"excel_viz Day 47: Robust VBA Error Handling & Event-Driven Automation: On Error GoTo, ScreenUpdating & Sheet Events",AGENT-383,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1204,"excel_viz Day 48: Modern Automation with TypeScript Office Scripts: Excel JavaScript API, Power Automate & Async Cloud Flows",AGENT-383,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1205,"excel_viz Day 49: Custom User-Defined Functions (UDFs) & Modern Lambda Helper Functions: LAMBDA Recursion, MAP, SCAN, REDUCE & BYROW",AGENT-383,Course 21 excel_viz,In_Progress,2026-10-17',
    'TASK-1206,"excel_viz Day 50: ⭐ Milestone 7: ApexAutomate Enterprise VBA & TypeScript Office Scripts Automation Suite",AGENT-383,Course 21 excel_viz,In_Progress,2026-10-17'
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    f.write("\n" + "\n".join(new_tasks) + "\n")

agent_row = 'AGENT-383,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1206,In_Progress,2026-10-17 21:55:00,"5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 4 — Course 21 excel_viz Days 46-50 & Milestone 7 Capstone: ApexAutomate Enterprise VBA & TypeScript Office Scripts Automation Suite (TASK-1202..1206)."'

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write("\n" + agent_row + "\n")

print("Batch 4 registered successfully with AGENT-383 and TASK-1202..1206!")
