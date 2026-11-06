import os

path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
row = 'AGENT-327,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-960,Completed,2026-10-17 00:44:00,"Block 194 (Branch A / Launchpad): Excel Viz Days 21-25 & Milestone 5 Capstone (Flexible Budgeting, PVM, ASC 606 Waterfall, TWCF Direct Cash, EVA Capital Allocation & Master Corporate FP&A Platform) committed & pushed (716e1d6a). 56/56 tests passing, Gate v2 bars specs."\n'

with open(path, "a", encoding="utf-8") as f:
    f.write(row)

print("Successfully updated multi_agent_control.csv")
