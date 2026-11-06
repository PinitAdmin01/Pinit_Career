import re

with open('src/lib/data/g3dLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'(?:["\']day["\']|day):\s*(\d+)', text)
day_ints = [int(d) for d in days]
print('Found days count:', len(day_ints))
print('Min day:', min(day_ints), 'Max day:', max(day_ints))
assert day_ints == list(range(1, 61)), f'Mismatch: {day_ints}'
print('SUCCESS! ALL 60 DAYS ARE SEQUENTIALLY PRESENT IN g3dLongLessons.ts!')
