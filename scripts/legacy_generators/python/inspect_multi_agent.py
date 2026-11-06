import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

mac_path = r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv'
print("=== multi_agent_control.csv ===")
try:
    with open(mac_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            print(row)
except Exception as e:
    print("Error reading mac:", e)

at_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
print("\n=== agent_tasks.csv (First 20 rows) ===")
try:
    with open(at_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            if i < 20:
                print(row)
except Exception as e:
    print("Error reading agent_tasks:", e)
