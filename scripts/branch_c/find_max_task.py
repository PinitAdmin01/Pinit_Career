import re

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv", "r", encoding="utf-8") as f:
    lines = f.readlines()

max_num = 0
for line in lines:
    m = re.match(r"TASK-(\d+)", line)
    if m:
        val = int(m.group(1))
        if val > max_num:
            max_num = val

print(f"Max task number: TASK-{max_num}")
