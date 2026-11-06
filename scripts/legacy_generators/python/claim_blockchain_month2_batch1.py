import datetime

def claim():
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_part, time_part = now_str.split(" ")

    control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
    tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

    # 1. Update multi_agent_control.csv
    with open(control_path, "r", encoding="utf-8") as f:
        ctrl_lines = f.readlines()

    updated_ctrl = []
    agent413_found = False
    for line in ctrl_lines:
        if "AGENT-413" in line:
            updated_ctrl.append(
                f'AGENT-413,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1344,In_Progress,{now_str},'
                '"CLAIMED: Month 2 Pioneer Batch 1: Block 7 — Course 20 (blockchain / Web3) Days 31-35 (AMM Constant Product Formula, Concentrated Liquidity Uniswap v3, TWAP Oracles, Flash Loans & Milestone 4 DeFi AMM Engine: TASK-1344..1348). Target: Advance Course 20 to 35/60 Days!"\n'
            )
            agent413_found = True
        else:
            updated_ctrl.append(line)

    if not agent413_found:
        updated_ctrl.append(
            f'AGENT-413,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1344,In_Progress,{now_str},'
            '"CLAIMED: Month 2 Pioneer Batch 1: Block 7 — Course 20 (blockchain / Web3) Days 31-35 (AMM Constant Product Formula, Concentrated Liquidity Uniswap v3, TWAP Oracles, Flash Loans & Milestone 4 DeFi AMM Engine: TASK-1344..1348). Target: Advance Course 20 to 35/60 Days!"\n'
        )

    with open(control_path, "w", encoding="utf-8") as f:
        f.writelines(updated_ctrl)
    print("Claimed AGENT-413 in multi_agent_control.csv")

    # 2. Add pending tasks to agent_tasks.csv if not present
    with open(tasks_path, "r", encoding="utf-8") as f:
        tasks_text = f.read()

    new_tasks = [
        f'TASK-1344,{date_part},{time_part},IN_PROGRESS,Block 7 (M2 Batch 1),Antigravity,Course 20 blockchain Day 31: Automated Market Makers (AMM): Constant Product Formula (x * y = k), Slippage & Impermanent Loss,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-31.json,IN_PROGRESS,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1345,{date_part},{time_part},PENDING,Block 7 (M2 Batch 1),Antigravity,Course 20 blockchain Day 32: Concentrated Liquidity AMMs (Uniswap v3): Ticks, Price Ranges, Tick Math & Capital Efficiency,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-32.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1346,{date_part},{time_part},PENDING,Block 7 (M2 Batch 1),Antigravity,Course 20 blockchain Day 33: Multi-Pool Routing, Price Impact, Arbitrage Mathematics & Fee Tier Economics,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-33.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1347,{date_part},{time_part},PENDING,Block 7 (M2 Batch 1),Antigravity,Course 20 blockchain Day 34: Flash Loans & Arbitrage: Single-Transaction Uncollateralized Borrowing & Pool Invariants,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-34.json,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
        f'TASK-1348,{date_part},{time_part},PENDING,Block 7 (M2 Batch 1),Antigravity,Course 20 blockchain Day 35: ⭐ MILESTONE 4: Sovereign Concentrated Liquidity AMM Protocol & Multi-Hop Flash Swap Engine,write_to_file; run_command,src/lib/data/blockchainLongLessons.ts; src/lib/data/lessonVisuals/blockchain/day-35.json; tests/blockchain_mobile_long_lessons.test.ts,PENDING,481047a5-cc08-4e1b-9b8c-e007e0b97879,\n',
    ]

    if "TASK-1344" not in tasks_text:
        with open(tasks_path, "a", encoding="utf-8") as f:
            for t in new_tasks:
                f.write(t)
        print("Appended TASK-1344..1348 to agent_tasks.csv")

if __name__ == "__main__":
    claim()
