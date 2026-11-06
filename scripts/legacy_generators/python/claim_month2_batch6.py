import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

# 1. Append tasks to agent_tasks.csv
tasks = [
    'TASK-1217,"excel_viz Day 56: Historic Catastrophe Post-Mortem 1: The $6.2 Billion JPMorgan \'London Whale\' VaR Formula Disaster",AGENT-386,Course 21 excel_viz,In_Progress,2026-10-17\n',
    'TASK-1218,"excel_viz Day 57: Historic Catastrophe Post-Mortem 2: The Reinhart-Rogoff $200B Austerity Omission (=AVERAGE(A1:A15) Range Error)",AGENT-386,Course 21 excel_viz,In_Progress,2026-10-17\n',
    'TASK-1219,"excel_viz Day 58: Historic Catastrophe Post-Mortem 3: Fannie Mae $1.3B Restatement & MI5 Wiretap Phone Truncation",AGENT-386,Course 21 excel_viz,In_Progress,2026-10-17\n',
    'TASK-1220,"excel_viz Day 59: Principal Financial Systems Architect Modernization RFC: Transitioning Monolithic Workbooks to Governed Lakehouses",AGENT-386,Course 21 excel_viz,In_Progress,2026-10-17\n',
    'TASK-1221,"excel_viz Day 60: 🏆 Capstone 2: ApexEnterpriseAnalytics Full-Scale Financial Engineering & Enterprise Data Modeling Master Capstone Viva Gate",AGENT-386,Course 21 excel_viz,In_Progress,2026-10-17\n'
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    f.writelines(tasks)

print("agent_tasks.csv updated: TASK-1217..1221 appended as In_Progress.")

# 2. Append to multi_agent_control.csv
agent_row = 'AGENT-386,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1221,In_Progress,2026-10-17 22:56:00,"5-Task Batch Protocol In Progress: Month 2 Pioneer Batch 6 (FINAL) — Course 21 excel_viz Days 56-60 & Grand Final Milestone Capstone: Historic Catastrophes (London Whale, Reinhart-Rogoff, Fannie Mae), Modernization Lakehouse RFC & ApexEnterpriseAnalytics Master Capstone Viva Gate (TASK-1217..1221)."\n'

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write(agent_row)

print("multi_agent_control.csv updated: AGENT-386 appended as In_Progress.")
