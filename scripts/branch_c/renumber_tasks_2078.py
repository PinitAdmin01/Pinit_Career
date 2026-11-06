csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

with open(csv_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for l in lines:
    if 'prompt-py Day 31:' in l:
        new_lines.append(l.replace('TASK-2068,', 'TASK-2078,'))
    elif 'prompt-py Day 32:' in l:
        new_lines.append(l.replace('TASK-2069,', 'TASK-2079,'))
    elif 'prompt-py Day 33:' in l:
        new_lines.append(l.replace('TASK-2070,', 'TASK-2080,'))
    elif 'prompt-py Day 34:' in l:
        new_lines.append(l.replace('TASK-2071,', 'TASK-2081,'))
    elif 'prompt-py Day 35:' in l:
        new_lines.append(l.replace('TASK-2072,', 'TASK-2082,'))
    else:
        new_lines.append(l)

with open(csv_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

with open(memory_path, 'r', encoding='utf-8') as f:
    mem_text = f.read()

mem_text = mem_text.replace('`TASK-2073` through `TASK-2077`', '`TASK-2078` through `TASK-2082`')
mem_text = mem_text.replace('`TASK-2068` through `TASK-2072`', '`TASK-2078` through `TASK-2082`')

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(mem_text)

print("Properly renumbered prompt-py tasks to TASK-2078 through TASK-2082!")
