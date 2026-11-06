import os
import re

files = sorted([f for f in os.listdir('src/lib/data') if f.endswith('LongLessons.ts')])

completed_60 = []
partial = []

for f in files:
    content = open(os.path.join('src/lib/data', f), encoding='utf-8').read()
    days = set(int(m) for m in re.findall(r'[\'\" ]?day[\'\" ]?:\s*(\d+)', content))
    valid_days = {d for d in days if 1 <= d <= 60}
    if len(valid_days) >= 60:
        completed_60.append((f, len(valid_days)))
    else:
        partial.append((f, len(valid_days), min(valid_days) if valid_days else 0, max(valid_days) if valid_days else 0))

print(f"=== 60-DAY 100% COMPLETED COURSES IN BRANCH A WORKSPACE ({len(completed_60)} Courses) ===")
for f, count in completed_60:
    print(f"  [PASS 60/60] {f}")

print(f"\n=== PARTIAL COURSES IN BRANCH A WORKSPACE ({len(partial)} Courses) ===")
for f, count, d_min, d_max in partial:
    print(f"  [{count:2d}/60 days] {f:<33} (Range: Day {d_min} to Day {d_max})")
