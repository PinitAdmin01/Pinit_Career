# scripts/inspect_days.py
import re

with open('src/lib/data/excelVizLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for d in [28, 29, 30]:
    m = re.search(r'(\{[^\{]*?day["\']?\s*:\s*' + str(d) + r',.*?"parts")', text, re.DOTALL)
    if m:
        print(f"\nDAY {d} HEADER:")
        print(m.group(1)[:300])
    else:
        print(f"\nDAY {d} NOT FOUND!")
