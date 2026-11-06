# scripts/check_memory_cloud.py
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, line in enumerate(lines):
    if any(k in line.lower() for k in ['course-cloud', 'course-devops', 'cloud_web', 'devops_web']):
        print(f"L{i}: {line}")
        for j in range(max(0, i-2), min(len(lines), i+8)):
            print(f"  {lines[j]}")
        print("---")
