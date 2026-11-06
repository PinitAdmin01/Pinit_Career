with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
lines = text.splitlines()
for idx, line in enumerate(lines):
    if '"day": 26' in line or 'day: 26' in line:
        for j in range(max(0, idx - 2), min(len(lines), idx + 20)):
            print(f"{j+1}: {lines[j]}")
        break
