import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
with open(mac_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

print(f"Total rows in multi_agent_control.csv: {len(rows)}")
for r in rows[-15:]:
    print(r[:8])
