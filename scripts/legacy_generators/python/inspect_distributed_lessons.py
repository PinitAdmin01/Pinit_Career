import re

with open('src/lib/data/distributedWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'(?:["\']day["\']|day):\s*(\d+)', text)
day_ints = [int(d) for d in days]
print('Found days count:', len(day_ints))
print('Min day:', min(day_ints) if day_ints else 0, 'Max day:', max(day_ints) if day_ints else 0)
print('First 300 chars:')
print(text[:300])
print('Last 300 chars:')
print(text[-300:])
