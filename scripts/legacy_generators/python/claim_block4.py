import csv
import datetime

csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

new_row = [
    'AGENT-418',
    'Antigravity',
    'agent/branch-b-curriculum-commerce-iot',
    'Present-Career-os-commerce',
    'TASK-1369',
    'In_Progress',
    datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'Branch B Block 4: Course 22 (Digital Accounting & Taxation) Days 16-20 (Tally Prime ERP Setup, Voucher Workflows, Indian GST Dual Architecture, GST ITC Cross-Utilization Section 49, Milestone 4 GST Compliance & Returns Capstone: TASK-1369..1373) in progress'
]

reader.append(new_row)

with open(csv_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(reader)

print("Registered AGENT-418 claim in multi_agent_control.csv successfully!")
