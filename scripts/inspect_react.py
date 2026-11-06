import re

with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    c = f.read()

days = sorted(list(set([int(d) for d in re.findall(r'(?:day)\s*:\s*(\d+)', c)])))
print('Total days found:', len(days))
print('Days list:', days)

# Check what matched in check_all_actual_days.py
matches = re.findall(r'(?:[\'"]?day[\'"]?)\s*:\s*(\d+)', c)
print('Matches from regex:', len(matches))
day_set = set()
for m in matches:
    val = int(m)
    if 1 <= val <= 60:
        day_set.add(val)
print('Valid days 1-60 from check_all_actual_days:', sorted(list(day_set)))
