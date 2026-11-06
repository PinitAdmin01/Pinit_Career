import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

with open(control_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_line = f'AGENT-408,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1319,In_Progress,{now_str},"Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 (Live Coding Communication, Scientific Debugging Under Pressure, Staff Engineer Archetypes, Coalition Building & Milestone 5 ApexInfluence Suite: TASK-1319..1323) in progress on Branch A"\n'

with open(control_path, "w", encoding="utf-8") as f:
    f.writelines(lines + [new_line])

print("Claimed AGENT-408 successfully!")
