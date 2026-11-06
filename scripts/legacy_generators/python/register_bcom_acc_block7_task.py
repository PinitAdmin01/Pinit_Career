import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. Update multi_agent_control.csv
with open(r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv', 'a', encoding='utf-8') as f:
    f.write(f'AGENT-501,Agent Branch B,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1866..1870,Active,{now_str},"Course 01 bcom_acc Month 2 Block 7 (Days 31-35 & Milestone 7 Capstone - Ind AS 115 Revenue, Ind AS 116 Leases, Ind AS 113 Fair Value, Ind AS 109 ECL)",,,,\n')

# 2. Update agent_tasks.csv
tasks_to_add = [
    ('TASK-1866', 'bcom_acc Day 31: Ind AS 115 Revenue from Contracts with Customers 5-Step Model', 'Active', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1867', 'bcom_acc Day 32: Ind AS 116 Leases ROU Asset & Lease Liability Front-Loading', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1868', 'bcom_acc Day 33: Ind AS 113 Fair Value Measurement Hierarchy Levels 1-3', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1869', 'bcom_acc Day 34: Ind AS 109 Financial Instruments Classification & 3-Stage ECL', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1870', 'bcom_acc Day 35: Milestone 7 Capstone Enterprise Financial Controller Ind AS Suite', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot')
]

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'a', encoding='utf-8') as f:
    for t_id, desc, status, commit, repo, branch in tasks_to_add:
        f.write(f'{t_id},{desc},{status},{commit},{repo},{branch},{now_str}\n')

print('Central tasks and control CSVs successfully registered for bcom_acc Block 7!')
