import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

print("Length:", len(text))
print("Last 1500 chars of PROJECT_MEMORY.md:")
print(text[-1500:])
