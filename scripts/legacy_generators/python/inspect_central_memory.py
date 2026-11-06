import csv

print("--- agent_tasks.csv ---")
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        if r.get("task_id") in ["TASK-1744", "TASK-1745", "TASK-1746", "TASK-1747", "TASK-1748"]:
            print(r)

print("\n--- multi_agent_control.csv ---")
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for r in reader:
        if r.get("agent_id") == "AGENT-480":
            print(r)
