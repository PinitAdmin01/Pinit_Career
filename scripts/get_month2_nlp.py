import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Month 2 Scope (Days 31&ndash;60')
if idx != -1:
    print(text[idx:idx+3500])
