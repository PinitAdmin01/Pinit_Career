import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

with open(control_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_line = f'AGENT-409,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1324,In_Progress,{now_str},"Month 2 Pioneer Batch 3: Block 9 -- Days 41-45 (Managing Executive C-Suite Stakeholders, 3-Year Technical Roadmaps, Technical Mentorship & Sponsorship, Reorgs & Pivots, Milestone 6 ApexStrategy Suite: TASK-1324..1328) in progress on Branch A"\n'

with open(control_path, "w", encoding="utf-8") as f:
    f.writelines(lines + [new_line])

print("Claimed AGENT-409 successfully!")
