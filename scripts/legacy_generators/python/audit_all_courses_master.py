import os
import re

files = [f for f in os.listdir('src/lib/data') if f.endswith('LongLessons.ts')]

courses_status = []
for f in sorted(files):
    path = os.path.join('src', 'lib', 'data', f)
    with open(path, 'r', encoding='utf-8') as handle:
        text = handle.read()
    days = re.findall(r'["\']day["\']:\s*(\d+)', text)
    if not days:
        days = re.findall(r'\bday:\s*(\d+)', text)
    int_days = sorted(list(set(int(d) for d in days)))
    courses_status.append((f, len(int_days), min(int_days) if int_days else 0, max(int_days) if int_days else 0))

print(f"Total LongLesson files: {len(courses_status)}")
for f, count, dmin, dmax in courses_status:
    status = "100% COMPLETE" if count >= 55 and dmax == 60 else f"PARTIAL ({count} days)"
    print(f"{f:<35}: {count:>2} days (range: {dmin:>2} - {dmax:>2}) -> {status}")
