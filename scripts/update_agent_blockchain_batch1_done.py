import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date_part, time_part = now_str.split(" ")

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# 1. Update multi_agent_control.csv
with open(control_path, 'r', encoding='utf-8') as f:
    ctrl_lines = f.readlines()

new_ctrl = []
for line in ctrl_lines:
    if line.startswith('AGENT-415,'):
        new_ctrl.append(
            f'AGENT-415,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1408,Completed,{now_str},'
            f'"BATCH COMPLETE: Course 7 (blockchain) Month 2 Pioneer Batch 1: Block 7 -- Days 31-35 (AMM Constant Product Formula, Concentrated Liquidity Uniswap v3, Over-Collateralized Lending, Flash Loans & Milestone 6 Concentrated Liquidity Engine: TASK-1404..1408) complete and tested. 14,875 words (all 5 days >= 24.8 spoken min, 35 total min/day), 62/62 tests passing, 0 tsc errors. Course 7 is 35/60 Days (58.3% Complete)!"\n'
        )
    else:
        new_ctrl.append(line)

with open(control_path, 'w', encoding='utf-8') as f:
    f.writelines(new_ctrl)

print("Updated multi_agent_control.csv successfully.")

# 2. Append completed tasks to agent_tasks.csv
tasks_to_add = [
    f'TASK-1404,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 7 blockchain Day 31: Automated Market Makers (AMM): Constant Product Formula (x * y = k) Slippage & Impermanent Loss,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-31.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1405,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 7 blockchain Day 32: Concentrated Liquidity AMMs (Uniswap v3): Ticks Price Ranges Tick Math & Capital Efficiency,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-32.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1406,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 7 blockchain Day 33: Decentralized Lending & Borrowing: Collateralization Ratios Health Factors & Liquidation Cascades,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-33.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1407,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 7 blockchain Day 34: Flash Loans & Arbitrage: Single-Transaction Uncollateralized Borrowing & Pool Invariants,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-34.json,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
    f'TASK-1408,{date_part},{time_part},COMPLETED,Block 7 (M2 Batch 1),Antigravity,Course 7 blockchain Day 35: 🏆 Milestone 6: Production Concentrated Liquidity AMM & Flash Lending Engine,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-35.json; tests/blockchain_days31_35_expansion.test.ts,COMPLETED,c7b35c15-f056-4dc6-888b-f56621a809c1,\n',
]

with open(tasks_path, 'r', encoding='utf-8') as f:
    existing_tasks = f.read()

with open(tasks_path, 'a', encoding='utf-8') as f:
    for t in tasks_to_add:
        tid = t.split(',')[0]
        if tid not in existing_tasks:
            f.write(t)

print("Updated agent_tasks.csv successfully.")
