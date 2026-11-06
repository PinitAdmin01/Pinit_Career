import sys
sys.stdout.reconfigure(encoding='utf-8')

tasks_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
control_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'

new_tasks = [
    'TASK-1449,2026-10-18,IN_PROGRESS,IN_PROGRESS,Block 7,Antigravity,Course 21 quant-systems Day 31: Options Pricing and Black-Scholes-Merton in Low-Latency,write_to_file; run_command,src/lib/data/quantSystemsLongLessons.ts; src/lib/data/lessonVisuals/quant-systems/day-31.json,IN_PROGRESS,codex/interview-tab-reliability,\n',
    'TASK-1450,2026-10-18,PENDING,PENDING,Block 7,Antigravity,Course 21 quant-systems Day 32: Real-Time Options Greeks and Portfolio Risk,write_to_file; run_command,src/lib/data/quantSystemsLongLessons.ts; src/lib/data/lessonVisuals/quant-systems/day-32.json,PENDING,codex/interview-tab-reliability,\n',
    'TASK-1451,2026-10-18,PENDING,PENDING,Block 7,Antigravity,Course 21 quant-systems Day 33: Delta-Neutral Hedging and Portfolio Gamma Scalping,write_to_file; run_command,src/lib/data/quantSystemsLongLessons.ts; src/lib/data/lessonVisuals/quant-systems/day-33.json,PENDING,codex/interview-tab-reliability,\n',
    'TASK-1452,2026-10-18,PENDING,PENDING,Block 7,Antigravity,Course 21 quant-systems Day 34: Volatility Surfaces Smiles and SABR Model Calibration,write_to_file; run_command,src/lib/data/quantSystemsLongLessons.ts; src/lib/data/lessonVisuals/quant-systems/day-34.json,PENDING,codex/interview-tab-reliability,\n',
    'TASK-1453,2026-10-18,PENDING,PENDING,Block 7,Antigravity,Course 21 quant-systems Day 35: Milestone 6: High-Frequency Options Market Making and Real-Time Greeks Engine,write_to_file; run_command,src/lib/data/quantSystemsLongLessons.ts; src/lib/data/lessonVisuals/quant-systems/day-35.json,PENDING,codex/interview-tab-reliability,\n'
]

with open(tasks_path, 'a', encoding='utf-8') as f:
    for t in new_tasks:
        f.write(t)

control_entry = 'AGENT-424,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1449,In_Progress,2026-10-18 18:36:00,"Course 21 (quant-systems) Month 2 Pioneer Batch 1: Block 7 -- Days 31-35 (Options Pricing and BSM in Low Latency, Real-Time Options Greeks and Portfolio Risk, Delta-Neutral Hedging and Gamma Scalping, Volatility Surfaces Smiles and SABR Model, and Milestone 6 High-Frequency Options Market Making and Real-Time Greeks Engine: TASK-1449..1453) in progress"\n'

with open(control_path, 'a', encoding='utf-8') as f:
    f.write(control_entry)

print('Central memory registered successfully for AGENT-424 TASK-1449..1453.')
