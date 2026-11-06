import re

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'r', encoding='utf-8') as f:
    content = f.read()

ids = [int(m) for m in re.findall(r'TASK-(\d+)', content)]
print('Max TASK ID:', max(ids) if ids else 'None', 'Count:', len(ids))

# Check lines containing TASK-109 or TASK-110
lines = content.splitlines()
for l in lines:
    if any(f"TASK-109{i}" in l or f"TASK-110{i}" in l for i in range(10)):
        print(l.encode('ascii', 'replace').decode('ascii'))
