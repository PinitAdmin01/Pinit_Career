import csv, sys

sys.stdout.reconfigure(encoding='utf-8')

print("--- AGENT-481 in multi_agent_control.csv ---")
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv", "r", encoding="utf-8") as f:
    for r in csv.reader(f):
        if r and r[0] == "AGENT-481":
            print(r)

print("\n--- TASK-1749..1753 in agent_tasks.csv ---")
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    for r in csv.reader(f):
        if r and r[0] in [f"TASK-{i}" for i in range(1749, 1754)]:
            print(r[0], r[3], r[9] if len(r) > 9 else '')
