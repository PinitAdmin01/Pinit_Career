# scripts/read_agent_tasks.py
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
if os.path.exists(tasks_path):
    with open(tasks_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"Total lines in agent_tasks.csv: {len(lines)}")
    print("Header:", lines[0].strip())
    # find lines mentioning cloud or devops or openrouter or iot_net
    for line in lines:
        if any(k in line.lower() for k in ['cloud', 'devops', 'iot_net', 'openrouter']):
            print(line.strip())
