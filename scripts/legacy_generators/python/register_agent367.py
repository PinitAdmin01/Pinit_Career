import sys

multi_control_line = 'AGENT-367,Antigravity,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1136,In_Progress,2026-10-17 17:15:00,"5-Task Batch Protocol In Progress: Course 30 bcom_ops Days 6-10 (Aggregate Planning, MRP I BOM Explosion, MRP II CRP Loading, TPS SMED Heijunka, Milestone 2 Lean Factory Control Tower, TASK-1132..1136)."\n'

task_lines = [
    'TASK-1132,Antigravity,In_Progress,"TASK-1132: B.Com Ops Day 6 Aggregate Production Planning (Chase vs Level Strategy)",2026-10-17\n',
    'TASK-1133,Antigravity,In_Progress,"TASK-1133: B.Com Ops Day 7 Materials Requirements Planning (MRP I) & BOM Explosion",2026-10-17\n',
    'TASK-1134,Antigravity,In_Progress,"TASK-1134: B.Com Ops Day 8 Manufacturing Resource Planning (MRP II) & Capacity Requirements Planning (CRP)",2026-10-17\n',
    'TASK-1135,Antigravity,In_Progress,"TASK-1135: B.Com Ops Day 9 Toyota Production System (TPS), Lean Waste Elimination & SMED",2026-10-17\n',
    'TASK-1136,Antigravity,In_Progress,"TASK-1136: B.Com Ops Day 10 Milestone 2 Capstone: Master Production Scheduling & Lean Factory Control Tower",2026-10-17\n'
]

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv', 'a', encoding='utf-8') as f:
    f.write(multi_control_line)

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'a', encoding='utf-8') as f:
    for line in task_lines:
        f.write(line)

print('Pre-flight registration completed successfully!')
