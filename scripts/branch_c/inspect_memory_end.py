with open(r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for l in lines[-25:]:
    print(l.rstrip())
