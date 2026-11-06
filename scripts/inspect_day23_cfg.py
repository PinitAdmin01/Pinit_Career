with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
lines = text.splitlines()
for idx, l in enumerate(lines):
    if '"day": 23' in l or 'day: 23' in l:
        for j in range(max(0, idx - 15), min(len(lines), idx + 2)):
            print(f"{j+1}: {lines[j]}")
        break
