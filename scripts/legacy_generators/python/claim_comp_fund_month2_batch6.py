import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

with open(control_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_line = f'AGENT-406,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1309,In_Progress,{now_str},"Month 2 Pioneer Batch 6 (FINAL COURSE 21 COMPLETION): Block 12 -- Days 56-60 (RFC, CIS Zero Trust, Chaos Engineering, Sustainable Systems and ApexEnterpriseOS Grand Capstone Viva: TASK-1309..1313) in progress on Branch A"\n'

with open(control_path, "w", encoding="utf-8") as f:
    f.writelines(lines + [new_line])

print("Claimed AGENT-406 successfully!")
