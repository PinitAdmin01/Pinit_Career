# -*- coding: utf-8 -*-
csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(csv_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
new_lines = []
for line in lines:
    if line.startswith('AGENT-415,'):
        new_lines.append(
            'AGENT-415,In_Progress,TASK-1394..1398,In_Progress,TASK-1399..1403 (Mobile Days 56-60 Grand Capstone),Completed TASK-1394..1398 on 2026-10-18 16:05:00,2026-10-18 16:07:00,'
            '"Month 2 Pioneer Batch 6: Block 12 -- Days 56-60 Fastlane Match, OTA Updates, Modern Store Compliance, Production Observability, and Grand Capstone Milestone 11: TASK-1399..1403 in progress"'
        )
    else:
        new_lines.append(line)

with open(csv_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines) + '\n')

print("Updated multi_agent_control.csv successfully!")
