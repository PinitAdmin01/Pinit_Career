import csv, sys

sys.stdout.reconfigure(encoding='utf-8')
with open(r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv", "r", encoding="utf-8") as f:
    for r in csv.reader(f):
        if r and len(r) > 4 and "AGENT-4" in r[0]:
            print(r[0], r[1] if len(r) > 1 else '', r[4] if len(r) > 4 else '', r[5] if len(r) > 5 else '')
