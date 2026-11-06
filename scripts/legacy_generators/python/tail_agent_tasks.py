import csv

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    rows = list(csv.reader(f))

print("Header:", rows[0])
print("Last 5 rows:")
for r in rows[-5:]:
    print(r)
