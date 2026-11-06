# scripts/inspect_days_in_ts.py
import re

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

matches = [(m.start(), m.group(0)) for m in re.finditer(r'["\']?day["\']?:\s*(\d+)', text)]
for idx, (pos, match) in enumerate(matches):
    print(f"{idx+1}: pos {pos} -> {match}")
