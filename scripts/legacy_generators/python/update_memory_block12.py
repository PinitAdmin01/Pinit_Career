import datetime

now_str = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

# 1. Update multi_agent_control.csv
with open(r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv', 'a', encoding='utf-8') as f:
    f.write(f'AGENT-501,Agent Branch B,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1851..1855,Completed,{now_str},"Block 11: Days 51-55 and Milestone 11 Capstone (bcom_law) completed, tested, and pushed (commit 03cb7a3b). Course 06 at 55/60 days.",,,,\n')
    f.write(f'AGENT-501,Agent Branch B,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1861..1865,Active,{now_str},"Course 06 bcom_law Month 2 Block 12 (Days 56-60 and Milestone 12 Grand Master Capstone - Transnational Corporate Restructuring, OFAC/FATF Sanctions, ISDS BIT Arbitration and General Counsel Simulator)",,,,\n')

# 2. Update agent_tasks.csv
tasks_to_add = [
    ('TASK-1851', 'bcom_law Day 51: ESG Regulatory Architecture and SEBI BRSR Core', 'Completed', '03cb7a3b', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1852', 'bcom_law Day 52: CSR Section 135 and Section 198 Net Profits', 'Completed', '03cb7a3b', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1853', 'bcom_law Day 53: Whistleblower Protections and Section 177 Vigil Mechanism', 'Completed', '03cb7a3b', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1854', 'bcom_law Day 54: Related Party Transactions and Section 188 Audit Gatekeeper', 'Completed', '03cb7a3b', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1855', 'bcom_law Day 55: Milestone 11 Capstone Enterprise ESG and Compliance Simulator', 'Completed', '03cb7a3b', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1861', 'bcom_law Day 56: Transnational Corporate Restructuring, Schemes of Arrangement (S.230-232) and Cross-Border Mergers', 'Active', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1862', 'bcom_law Day 57: Global Sanctions Compliance, OFAC, FATF AML Architecture and Transnational Financial Crime Prevention', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1863', 'bcom_law Day 58: Investor-State Dispute Settlement (ISDS), Bilateral Investment Treaties and Commercial Arbitration', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1864', 'bcom_law Day 59: Hostile Takeovers, Poison Pills and SEBI Substantial Acquisition of Shares (SAST) Defense', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot'),
    ('TASK-1865', 'bcom_law Day 60: Milestone 12 Grand Master Capstone Transnational General Counsel Boardroom Crisis Simulator', 'Pending', '', 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot')
]

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'a', encoding='utf-8') as f:
    for t_id, desc, status, commit, repo, branch in tasks_to_add:
        f.write(f'{t_id},{desc},{status},{commit},{repo},{branch},{now_str}\n')

print('Central tasks and control CSVs successfully updated!')
