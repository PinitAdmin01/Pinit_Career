import csv, sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        if r.get("Task_ID") in ["TASK-1744", "TASK-1745", "TASK-1746", "TASK-1747", "TASK-1748"]:
            print(r["Task_ID"], r["Status"], r["Agent_Resolution"])
