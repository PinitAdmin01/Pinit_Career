with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find Day 26 to 30 configs
for day_num in range(26, 31):
    m = re.search(r'("day":\s*' + str(day_num) + r',[\s\S]*?"aTitle":\s*"[^"]*")', text)
    if m:
        print(f"--- Day {day_num} config ---")
        print(m.group(1))
