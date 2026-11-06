import re

with open('src/lib/data/bcomAccountingLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'day:\s*(\d+)', text)
days_int = sorted(list(set(int(d) for d in days)))
print('Unique days found:', days_int)
print('Total unique days:', len(days_int))
print('Min day:', min(days_int) if days_int else None, 'Max day:', max(days_int) if days_int else None)
