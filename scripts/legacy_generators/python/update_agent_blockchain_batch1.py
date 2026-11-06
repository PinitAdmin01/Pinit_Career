# -*- coding: utf-8 -*-
csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(csv_path, 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
new_lines = []
for line in lines:
    if line.startswith('AGENT-415,'):
        new_lines.append(
            'AGENT-415,In_Progress,TASK-1399..1403,In_Progress,TASK-1404..1408 (Blockchain Days 31-35),Completed TASK-1399..1403 on 2026-10-18 16:15:00,2026-10-18 16:22:00,'
            '"Month 2 Pioneer Batch 1: Block 7 -- Days 31-35 Constant Product AMM, Concentrated Liquidity Uniswap v3, Over-Collateralized Lending, Flash Loans, and Milestone 6 Concentrated Liquidity Engine: TASK-1404..1408 in progress"'
        )
    else:
        new_lines.append(line)

with open(csv_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines) + '\n')

print("Updated multi_agent_control.csv for Blockchain Batch 1 successfully!")
