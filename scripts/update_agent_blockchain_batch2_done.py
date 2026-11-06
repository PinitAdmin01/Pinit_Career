import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

# 1. Update multi_agent_control.csv
with open(control_path, 'r', encoding='utf-8') as f:
    ctrl_lines = f.readlines()

new_ctrl = []
for line in ctrl_lines:
    if line.startswith('AGENT-415,'):
        new_ctrl.append(
            f'AGENT-415,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1413,Completed,{now_str},'
            f'"BATCH COMPLETE: Course 7 (blockchain) Month 2 Pioneer Batch 2: Block 8 -- Days 36-40 (Price Oracles TWAP/Chainlink, Oracle Manipulation Attacks & Circuit Breakers, Cross-Chain Bridges, CCIP/LayerZero Messaging & Milestone 7 Multi-Oracle Aggregator & Bridge: TASK-1409..1413) complete and tested. 14,875 words (all 5 days >= 24.8 spoken min, 35 total min/day), 63/63 tests passing, 0 tsc errors. Course 7 is 40/60 Days (66.7% Complete)!"\n'
        )
    else:
        new_ctrl.append(line)

with open(control_path, 'w', encoding='utf-8') as f:
    f.writelines(new_ctrl)

print("Updated multi_agent_control.csv successfully.")

# 2. Update status of TASK-1409..1413 in agent_tasks.csv
with open(tasks_path, 'r', encoding='utf-8') as f:
    task_lines = f.readlines()

new_tasks = []
target_tasks = {"TASK-1409", "TASK-1410", "TASK-1411", "TASK-1412", "TASK-1413"}

for line in task_lines:
    parts = line.split(',')
    tid = parts[0]
    if tid in target_tasks:
        parts[3] = "COMPLETED"
        parts[9] = "COMPLETED"
        new_tasks.append(','.join(parts))
    else:
        new_tasks.append(line)

with open(tasks_path, 'w', encoding='utf-8') as f:
    f.writelines(new_tasks)

print("Updated agent_tasks.csv successfully.")
