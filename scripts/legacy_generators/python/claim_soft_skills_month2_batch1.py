import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

with open(control_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_line = f'AGENT-407,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1314,In_Progress,{now_str},"Month 2 Pioneer Batch 1: Block 7 -- Days 31-35 (System Design Interview Protocol, Whiteboard Driving, Trade-Off Communication, Handling Pushback & Curveballs, Milestone 4 ApexDesign Suite: TASK-1314..1318) in progress on Branch A"\n'

with open(control_path, "w", encoding="utf-8") as f:
    f.writelines(lines + [new_line])

print("Claimed AGENT-407 successfully!")
