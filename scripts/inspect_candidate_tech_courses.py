import re

for fname in ['designWebLongLessons.ts', 'cyberWebLongLessons.ts', 'distributedWebLongLessons.ts', 'aiWebLongLessons.ts']:
    with open('src/lib/data/' + fname, 'r', encoding='utf-8') as f:
        c = f.read()
    days = sorted(list(set([int(d) for d in re.findall(r'(?:["\']?day["\']?)\s*:\s*(\d+)', c)])))
    print(f"{fname}: {len(days)} days, min={min(days) if days else None}, max={max(days) if days else None}")
