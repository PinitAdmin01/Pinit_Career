import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    rows = list(csv.reader(f))

print("Total rows:", len(rows))
print("Last row:", rows[-1])
