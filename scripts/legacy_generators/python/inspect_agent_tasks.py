with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines in agent_tasks.csv: {len(lines)}")
print("Last 15 lines:")
for l in lines[-15:]:
    print(l.strip())
