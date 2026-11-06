import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date_part, time_part = now_str.split(" ")

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# 1. Update multi_agent_control.csv
with open(control_path, 'r', encoding='utf-8') as f:
    ctrl_lines = f.readlines()

new_ctrl = []
agent415_found = False
for line in ctrl_lines:
    if line.startswith('AGENT-415,'):
        new_ctrl.append(
            f'AGENT-415,In_Progress,TASK-1409..1413,In_Progress,TASK-1414..1418 (Blockchain Days 41-45),Completed TASK-1409..1413 on {now_str},{now_str},'
            f'"Month 2 Pioneer Batch 3: Block 9 -- Days 41-45 Proxy Pattern Foundations delegatecall, Transparent Upgradeable Proxy TUP, Universal Upgradeable Proxy Standard UUPS, Diamond Standard ERC-2535 & Milestone 8 Diamond Upgrade Engine: TASK-1414..1418 in progress"\n'
        )
        agent415_found = True
    else:
        new_ctrl.append(line)

if not agent415_found:
    new_ctrl.append(
        f'AGENT-415,In_Progress,TASK-1409..1413,In_Progress,TASK-1414..1418 (Blockchain Days 41-45),Completed TASK-1409..1413 on {now_str},{now_str},'
        f'"Month 2 Pioneer Batch 3: Block 9 -- Days 41-45 Proxy Pattern Foundations delegatecall, Transparent Upgradeable Proxy TUP, Universal Upgradeable Proxy Standard UUPS, Diamond Standard ERC-2535 & Milestone 8 Diamond Upgrade Engine: TASK-1414..1418 in progress"\n'
    )

with open(control_path, 'w', encoding='utf-8') as f:
    f.writelines(new_ctrl)

print("Updated multi_agent_control.csv successfully.")

# 2. Append pending tasks to agent_tasks.csv
tasks_to_add = [
    f'TASK-1414,{date_part},{time_part},IN_PROGRESS,Block 9 (M2 Batch 3),Antigravity,Course 7 blockchain Day 41: Proxy Pattern Foundations: delegatecall Storage Collision Hazards & The Implementation Split,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-41.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1415,{date_part},{time_part},PENDING,Block 9 (M2 Batch 3),Antigravity,Course 7 blockchain Day 42: Transparent Upgradeable Proxy (TUP): Admin Fallback Collisions & Function Selector Clashes,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-42.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1416,{date_part},{time_part},PENDING,Block 9 (M2 Batch 3),Antigravity,Course 7 blockchain Day 43: Universal Upgradeable Proxy Standard (UUPS - EIP-1822): Implementation Upgrades & Self-Destruct Risks,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-43.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1417,{date_part},{time_part},PENDING,Block 9 (M2 Batch 3),Antigravity,Course 7 blockchain Day 44: The Diamond Standard (ERC-2535): Multi-Facet Proxies Function Selectors & Diamond Loupe,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-44.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1418,{date_part},{time_part},PENDING,Block 9 (M2 Batch 3),Antigravity,Course 7 blockchain Day 45: 🏆 Milestone 8: Production ERC-2535 Diamond Multi-Facet Modular Upgrade Engine,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-45.json; tests/blockchain_days41_45_expansion.test.ts,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
]

with open(tasks_path, 'r', encoding='utf-8') as f:
    existing_tasks = f.read()

with open(tasks_path, 'a', encoding='utf-8') as f:
    for t in tasks_to_add:
        tid = t.split(',')[0]
        if tid not in existing_tasks:
            f.write(t)

print("Updated agent_tasks.csv successfully.")
