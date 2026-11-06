# scripts/find_cloud_devops_tasks.py
import sys, os
sys.stdout.reconfigure(encoding='utf-8')

tasks_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    low = line.lower()
    if 'cloud-native' in low or 'devops-cicd' in low or 'cloud_web' in low or 'devops_web' in low:
        print(line.strip())
