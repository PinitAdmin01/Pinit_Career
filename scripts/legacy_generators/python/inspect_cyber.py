import re

with open('src/lib/data/cyberWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'"day":\s*(\d+)', text)]
print('Cyber days count:', len(days))
print('Min day:', min(days) if days else None, 'Max day:', max(days) if days else None)
print('Days present:', days)
