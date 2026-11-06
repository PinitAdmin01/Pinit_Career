import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for "Block 9 (Days 41-45"
for line in text.split('\n'):
    if 'Block 9 (Days 41-45' in line or 'Block 9: Days 41' in line or 'Days 41-45' in line:
        if 'nlp' in line.lower() or 'alignment' in line.lower() or 'preference' in line.lower():
            print(line)
