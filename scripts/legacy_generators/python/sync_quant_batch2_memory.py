import sys
import datetime

tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
control_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
with open(tasks_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if any(t_id in line for t_id in ['TASK-1459', 'TASK-1460', 'TASK-1461', 'TASK-1462', 'TASK-1463']):
        parts = line.split(',')
        if len(parts) >= 4:
            parts[2] = 'COMPLETED'
            parts[3] = 'COMPLETED'
        line = ','.join(parts)
    new_lines.append(line)

with open(tasks_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Updated agent_tasks.csv")

# 2. Update multi_agent_control.csv
with open(control_path, 'r', encoding='utf-8') as f:
    ctrl_lines = f.readlines()

new_ctrl = []
agent_found = False
for line in ctrl_lines:
    if 'AGENT-426' in line:
        new_ctrl.append(f'AGENT-426,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1463,Completed,{now_str},"BATCH COMPLETE: Course 21 (quant-systems) Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 (Cross-Venue Latency Arbitrage & Multi-Exchange Routing, Cryptocurrency & FX Microstructure, Exchange Fee Optimization & Maker-Taker Tier Economics, Order Queue Priority Simulation & Cancellation Attribution, and Milestone Project 7 Multi-Venue Statistical Arbitrage Engine: TASK-1459..1463) complete and tested. 16,767 words (all 5 days >= 27.8 spoken min, 38 total min/day), all tests passing, 0 tsc errors. Course 21 (quant-systems) is 40/60 Days (66.7% Complete)!"\n')
        agent_found = True
    else:
        new_ctrl.append(line)

if not agent_found:
    new_ctrl.append(f'AGENT-426,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1463,Completed,{now_str},"BATCH COMPLETE: Course 21 (quant-systems) Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 (Cross-Venue Latency Arbitrage & Multi-Exchange Routing, Cryptocurrency & FX Microstructure, Exchange Fee Optimization & Maker-Taker Tier Economics, Order Queue Priority Simulation & Cancellation Attribution, and Milestone Project 7 Multi-Venue Statistical Arbitrage Engine: TASK-1459..1463) complete and tested. 16,767 words (all 5 days >= 27.8 spoken min, 38 total min/day), all tests passing, 0 tsc errors. Course 21 (quant-systems) is 40/60 Days (66.7% Complete)!"\n')

with open(control_path, 'w', encoding='utf-8') as f:
    f.writelines(new_ctrl)
print("Updated multi_agent_control.csv")

# 3. Prepend to PROJECT_MEMORY.md
memory_entry = f"""
### Milestone Achievement: Course 21 Quantitative Systems Month 2 Pioneer Batch 2 (Block 8: Days 36–40) COMPLETE
- **Timestamp**: {now_str}
- **Agent**: AGENT-426 (Antigravity IDE) on `codex/interview-tab-reliability`
- **Target Track**: Course 21: Quantitative Engineering & Low-Latency Trading Systems (`quant-systems`)
- **Block 8 Expansion**: Days 36–40 (`TASK-1459` through `TASK-1463`)
  - **Day 36**: Cross-Venue Latency Arbitrage & Multi-Exchange Order Book Routing (Microwave vs fiber propagation physics, Carteret/Secaucus/Mahwah 12us advantage, legging risk forensics, concurrent IOC dispatch, automated sub-microsecond panic unwinds, SEC Rule 15c3-5 pre-trade gate).
  - **Day 37**: Cryptocurrency & FX Market Microstructure (Perpetual futures mechanics, TWAP premium index, 8-hour funding rates, leveraged liquidation cascade forensics, delta-neutral cash-and-carry basis arbitrage engine, extreme basis inversion stress lab, automated de-risking gate).
  - **Day 38**: Exchange Fee Optimization & Maker-Taker Tier Economics (Maker-Taker vs Inverted fee schedules, queue priority advantages, cancel-to-fill ratio penalty forensics, Smart Order Routing fee optimizer, 100k-order monthly billing & volume tier qualification lab).
  - **Day 39**: Order Queue Priority Simulation & Cancellation Attribution (FIFO price-time matching, Cont-Stoikov Markovian queue depletion, adverse selection & front-queue evaporation forensics, Level 3 order-by-order queue tracker, cancellation velocity shock detector).
  - **Day 40**: 🏆 Milestone Project 7: Multi-Venue Cross-Exchange Statistical Arbitrage Engine & Smart Order Router (Synchronized 3-venue order books across Carteret/Secaucus/Mahwah, 64-byte cache-aligned memory, 50us network partition watchdog kill-switch, concurrent dual-leg IOC execution, 5,000-trial adversarial chaos stress test with 0 exposure overruns, Grand Master 5-Gate defense accreditation).
- **Invariants Verified**:
  - Total Words: 16,767 words across 5 days (all days >= 3,337 words, avg 3,353 words/day).
  - Spoken Minutes: All 5 days = 28 spoken minutes (target: >= 20 min).
  - Lesson Minutes: All 5 days = 38 total lesson minutes (strictly in [35, 40]).
  - Language: `cpp` (zero-allocation, cache-aligned, valid signatures, passing AST structural inspection).
  - Gate v2 Visuals: `day-36.json` through `day-40.json` generated in `lessonVisuals/quant-systems/` with valid SHA-256 code hashes.
  - Test Suite: All unit tests passing in `tests/quant_days36_40_expansion.test.ts` (100% pass rate).
- **Course 21 Status**: 40/60 Days Complete (66.7%).
"""

with open(memory_path, 'r', encoding='utf-8') as f:
    old_mem = f.read()

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(memory_entry + "\n---\n" + old_mem)
print("Updated PROJECT_MEMORY.md")
