import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    text = f.read()

for i in range(1749, 1754):
    print(f"TASK-{i} in agent_tasks.csv:", f"TASK-{i}" in text)
