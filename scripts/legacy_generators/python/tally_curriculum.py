import glob
import os
import re

files = glob.glob('src/lib/data/*LongLessons.ts')
total_days = 0
courses_60 = []
courses_30 = []
other = []

for f in sorted(files):
    base = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    days = re.findall(r'\bday\s*:\s*(\d+)|\"day\"\s*:\s*(\d+)', text)
    count = len(days)
    total_days += count
    if count == 60:
        courses_60.append(base)
    elif count == 30:
        courses_30.append(base)
    else:
        other.append((base, count))

print(f"Total LongLesson days across all files in this workspace: {total_days}")
print(f"60-Day Complete Courses ({len(courses_60)}):")
for c in courses_60:
    print(f"  - {c}")
print(f"30-Day Complete Courses ({len(courses_30)}):")
for c in courses_30:
    print(f"  - {c}")
