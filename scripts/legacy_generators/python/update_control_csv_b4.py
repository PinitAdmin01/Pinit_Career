import csv
import datetime

csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

updated = False
for row in reader:
    if len(row) > 0 and row[0] == 'AGENT-418':
        row[5] = 'Completed'
        row[6] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        row[7] = "BATCH COMPLETE: Branch B Block 4: Course 22 (Digital Accounting & Taxation) Days 16-20 (Tally Prime ERP Masters, Voucher Workflows, Indian Dual GST Model, GST ITC Set-Off Section 49, Milestone 4 GST Returns & Auto-Reconciliation Capstone: TASK-1369..1373) complete and tested. 14,750 words (all 5 days >= 580 words/part, 2,950 words/day), 38/38 unit tests passing, 0 tsc errors, committed (48541af5) and pushed to origin/agent/branch-b-curriculum-commerce-iot! Course 22 is 20/30 Days (66.7% Complete)!"
        updated = True
        break

if updated:
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(reader)
    print("Updated AGENT-418 to Completed in multi_agent_control.csv")
else:
    print("AGENT-418 not found")
