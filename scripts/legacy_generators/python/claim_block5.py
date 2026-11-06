import csv
import datetime

csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

new_row = [
    'AGENT-419',
    'Antigravity',
    'agent/branch-b-curriculum-commerce-iot',
    'Present-Career-os-commerce',
    'TASK-1374',
    'In_Progress',
    datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'Branch B Block 5: Course 22 (Digital Accounting & Taxation) Days 21-25 (Tally & GST Lifecycle Synthesis, RCM & E-Way Bills, Corporate Payroll Accounting, TDS Withholding Tax, Milestone 5 Direct Tax & New Regime Capstone: TASK-1374..1378) in progress'
]

reader.append(new_row)

with open(csv_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(reader)

print("Registered AGENT-419 claim in multi_agent_control.csv successfully!")
