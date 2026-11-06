import csv, sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    print("Columns:", reader.fieldnames)
    for r in reader:
        if "480" in str(r.values()):
            print(r)
