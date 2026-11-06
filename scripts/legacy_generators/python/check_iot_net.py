# scripts/check_iot_net.py
import re

with open('src/lib/data/iotNetLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

d1 = [int(x) for x in re.findall(r'(?<!")day:\s*(\d+)', text)]
d2 = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]

print(f"Total lines: {len(text.splitlines())}")
print(f"unquoted day: {d1}")
print(f"quoted day: count={len(d2)}, min={min(d2) if d2 else None}, max={max(d2) if d2 else None}")
all_days = sorted(list(set(d1 + d2)))
print(f"All combined days: count={len(all_days)}, min={min(all_days) if all_days else None}, max={max(all_days) if all_days else None}")
missing = [d for d in range(1, 61) if d not in all_days]
print(f"Missing days: {missing}")
