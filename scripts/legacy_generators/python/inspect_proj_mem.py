import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length of PROJECT_MEMORY.md:", len(text))
for line in text.splitlines()[:50]:
    print(line)
