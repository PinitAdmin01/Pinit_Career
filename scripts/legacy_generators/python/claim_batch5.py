import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
today_str = datetime.datetime.now().strftime("%Y-%m-%d")

# 1. Register TASK-1162..1166 in agent_tasks.csv
tasks_file = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
new_tasks = [
    f'TASK-1162,Antigravity,In_Progress,"TASK-1162: Expand Workplace Soft Skills Day 26: Overcoming Impostor Syndrome, Professional Boundary Setting & Healthy Assertiveness in Tech"\n',
    f'TASK-1163,Antigravity,In_Progress,"TASK-1163: Expand Workplace Soft Skills Day 27: Cross-Cultural Engineering Communication: Collaborating with Global Distributed Teams"\n',
    f'TASK-1164,Antigravity,In_Progress,"TASK-1164: Expand Workplace Soft Skills Day 28: Influence Without Authority: Driving Technical Change & Championing Architectural RFCs"\n',
    f'TASK-1165,Antigravity,In_Progress,"TASK-1165: Expand Workplace Soft Skills Day 29: Writing Compelling Tech Specs & Architecture RFCs: Structural Clarity & Consensus Building"\n',
    f'TASK-1166,Antigravity,In_Progress,"TASK-1166: Expand Workplace Soft Skills Day 30: ⭐ MILESTONE 4: Final Career Capstone — The Complete Executive Engineering Portfolio & Technical Leadership Mastery"\n'
]

with open(tasks_file, 'a', encoding='utf-8') as f:
    f.writelines(new_tasks)
print('TASK-1162..1166 registered in agent_tasks.csv.')

# 2. Register AGENT-375 in multi_agent_control.csv
mac_file = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
mac_entry = f'AGENT-375,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1166,In_Progress,{now_str},"5-Task Batch Protocol In Progress: Course 24 soft_skills Days 26-30 (FINAL BATCH: Boundary Setting, Cross-Cultural Distributed Teams, Influence Without Authority, Tech Specs & RFCs, Milestone 4 Grand Capstone, TASK-1162..1166)."\n'

with open(mac_file, 'a', encoding='utf-8') as f:
    f.write(mac_entry)
print('AGENT-375 claimed in multi_agent_control.csv.')
