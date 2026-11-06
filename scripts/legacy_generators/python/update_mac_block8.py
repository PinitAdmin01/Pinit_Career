import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
row = f'AGENT-500,Antigravity,main,Present-Career-os,TASK-1961..1965,Completed,{now_str},"Block 8: Days 36-40 & Milestone 8 Capstone (design-systems / Overlay Architecture & Floating UI) completed, tested (100% pass, 0 tsc errors), and pushed. 15,565 words generated (all 25 parts >= 600 words). Course 06 at 40/60 Days.",,,,\n'

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv', 'a', encoding='utf-8') as f:
    f.write(row)

print("Updated multi_agent_control.csv!")
