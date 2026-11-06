csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

with open(csv_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the prompt-py task IDs at the bottom
text = text.replace('TASK-2068,"prompt-py', 'TASK-2073,"prompt-py')
text = text.replace('TASK-2069,"prompt-py', 'TASK-2074,"prompt-py')
text = text.replace('TASK-2070,"prompt-py', 'TASK-2075,"prompt-py')
text = text.replace('TASK-2071,"prompt-py', 'TASK-2076,"prompt-py')
text = text.replace('TASK-2072,"prompt-py', 'TASK-2077,"prompt-py')

with open(csv_path, 'w', encoding='utf-8') as f:
    f.write(text)

with open(memory_path, 'r', encoding='utf-8') as f:
    mem_text = f.read()

mem_text = mem_text.replace('`TASK-2068` through `TASK-2072`', '`TASK-2073` through `TASK-2077`')

with open(memory_path, 'w', encoding='utf-8') as f:
    f.write(mem_text)

print("Renumbered prompt-py tasks to TASK-2073 through TASK-2077!")
