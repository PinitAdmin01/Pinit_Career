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
            f'AGENT-415,In_Progress,TASK-1404..1408,In_Progress,TASK-1409..1413 (Blockchain Days 36-40),Completed TASK-1404..1408 on {now_str},{now_str},'
            f'"Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 Price Oracles TWAP/Chainlink, Oracle Manipulation Attacks & Circuit Breakers, Cross-Chain Bridges, CCIP/LayerZero Messaging, and Milestone 7 Multi-Oracle Aggregator & Bridge: TASK-1409..1413 in progress"\n'
        )
        agent415_found = True
    else:
        new_ctrl.append(line)

if not agent415_found:
    new_ctrl.append(
        f'AGENT-415,In_Progress,TASK-1404..1408,In_Progress,TASK-1409..1413 (Blockchain Days 36-40),Completed TASK-1404..1408 on {now_str},{now_str},'
        f'"Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 Price Oracles TWAP/Chainlink, Oracle Manipulation Attacks & Circuit Breakers, Cross-Chain Bridges, CCIP/LayerZero Messaging, and Milestone 7 Multi-Oracle Aggregator & Bridge: TASK-1409..1413 in progress"\n'
    )

with open(control_path, 'w', encoding='utf-8') as f:
    f.writelines(new_ctrl)

print("Updated multi_agent_control.csv successfully.")

# 2. Append pending tasks to agent_tasks.csv
tasks_to_add = [
    f'TASK-1409,{date_part},{time_part},IN_PROGRESS,Block 8 (M2 Batch 2),Antigravity,Course 7 blockchain Day 36: Price Oracle Architectures: On-Chain TWAP vs Decentralized Off-Chain Oracles (Chainlink),write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-36.json,IN_PROGRESS,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1410,{date_part},{time_part},PENDING,Block 8 (M2 Batch 2),Antigravity,Course 7 blockchain Day 37: Oracle Manipulation Attacks: Spot Price Flash Loan Distortions & Circuit Breaker Defenses,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-37.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1411,{date_part},{time_part},PENDING,Block 8 (M2 Batch 2),Antigravity,Course 7 blockchain Day 38: Cross-Chain Bridges: Lock-and-Mint vs Burn-and-Mint Relayers & The Ronin Bridge Hack,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-38.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1412,{date_part},{time_part},PENDING,Block 8 (M2 Batch 2),Antigravity,Course 7 blockchain Day 39: Cross-Chain Protocols: Chainlink CCIP & LayerZero (Generalized Messaging & Replay Defenses),write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-39.json,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1413,{date_part},{time_part},PENDING,Block 8 (M2 Batch 2),Antigravity,Course 7 blockchain Day 40: 🏆 Milestone 7: Tamper-Proof Multi-Oracle Aggregator & Cross-Chain Bridge Engine,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-40.json; tests/blockchain_days36_40_expansion.test.ts,PENDING,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
]

with open(tasks_path, 'r', encoding='utf-8') as f:
    existing_tasks = f.read()

with open(tasks_path, 'a', encoding='utf-8') as f:
    for t in tasks_to_add:
        tid = t.split(',')[0]
        if tid not in existing_tasks:
            f.write(t)

print("Updated agent_tasks.csv successfully.")
