import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

pos = 0
while True:
    idx = text.find('Block 12', pos)
    if idx == -1:
        break
    print("Found Block 12 at", idx, ":")
    print(text[idx:idx+500])
    print("-" * 50)
    pos = idx + len('Block 12') + 100
