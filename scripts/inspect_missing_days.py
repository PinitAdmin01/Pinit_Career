# scripts/inspect_missing_days.py
import re

for fname in ['fullstackJsLongLessons.ts', 'g3dLongLessons.ts', 'designWebLongLessons.ts']:
    with open('src/lib/data/' + fname, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    days = [int(x) for x in re.findall(r'"day":\s*(\d+)', c)]
    print(f"{fname}: {len(days)} days found: min={min(days) if days else None}, max={max(days) if days else None}")
    missing = [d for d in range(1, 61) if d not in days]
    print(f"  Missing days: {missing}")
