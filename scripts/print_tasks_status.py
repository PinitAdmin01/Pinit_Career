import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    for row in csv.reader(f):
        if row and row[0] in ["TASK-1744", "TASK-1745", "TASK-1746", "TASK-1747", "TASK-1748"]:
            print(row[0], row[3], row[6])
