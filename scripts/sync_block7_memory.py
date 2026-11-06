# scripts/sync_block7_memory.py
import csv
from datetime import datetime

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
control_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"

# 1. Update agent_tasks.csv
with open(tasks_path, "r", encoding="utf-8") as f:
    reader = list(csv.reader(f))

header = reader[0]
rows = reader[1:]

updated_count = 0
for r in rows:
    if len(r) > 0 and r[0] in ["TASK-1754", "TASK-1755", "TASK-1756", "TASK-1757", "TASK-1758"]:
        r[3] = "COMPLETED"
        if len(r) > 6:
            r[6] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        updated_count += 1

with open(tasks_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"Updated {updated_count} tasks to COMPLETED in agent_tasks.csv")

# 2. Update multi_agent_control.csv
with open(control_path, "r", encoding="utf-8") as f:
    c_reader = list(csv.reader(f))

c_header = c_reader[0]
c_rows = c_reader[1:]

c_updated = 0
for cr in c_rows:
    if len(cr) > 0 and cr[0] == "AGENT-482":
        cr[3] = "Completed"
        cr[6] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        c_updated += 1

with open(control_path, "w", encoding="utf-8", newline="") as f:
    c_writer = csv.writer(f)
    c_writer.writerow(c_header)
    c_writer.writerows(c_rows)

print("Updated AGENT-482 to Completed in multi_agent_control.csv")
