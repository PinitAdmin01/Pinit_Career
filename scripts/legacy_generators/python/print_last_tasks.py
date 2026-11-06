import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    rows = list(csv.reader(f))

print(f"Total rows: {len(rows)}")
for r in rows[-20:]:
    if r:
        print(r[0], r[3] if len(r) > 3 else '', r[6] if len(r) > 6 else '')
