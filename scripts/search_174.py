import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    for idx, row in enumerate(csv.reader(f)):
        if any("174" in cell for cell in row):
            print(idx, row[0], row[3] if len(row) > 3 else '', row[6] if len(row) > 6 else '')
