import csv
import datetime

csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

updated = False
for row in reader:
    if len(row) > 0 and row[0] == 'AGENT-417':
        row[5] = 'Completed'
        row[6] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        row[7] = "BATCH COMPLETE: Branch B Block 3: Course 22 (Digital Accounting & Taxation) Days 11-15 (Depreciation SLM/WDV, Trading Account COGS, Profit & Loss Operating Margin, Balance Sheet Marshalling & Working Capital, Milestone 3 Year-End Closing Capstone: TASK-1364..1368) complete and tested. 15,498 words (all 5 days >= 580 words/part, >= 2,950 words/day), 31/31 unit tests passing, 0 tsc errors, committed (c511ca5e) and pushed to origin/agent/branch-b-curriculum-commerce-iot! Course 22 is 15/30 Days (50.0% Complete)!"
        updated = True
        break

if updated:
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(reader)
    print("Updated AGENT-417 to Completed in multi_agent_control.csv")
else:
    print("AGENT-417 not found")
