import re

with open('src/lib/data/iotEdgeLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(x) for x in re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text)]
print(f'Total days in iotEdgeLongLessons.ts: {len(days)}')
print('Days list:', days)
