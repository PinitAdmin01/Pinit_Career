import glob
import os
import re

files = sorted(glob.glob('src/lib/data/*LongLessons.ts'))

courses_info = []
total_days = 0

for f in files:
    fname = os.path.basename(f)
    if fname == 'longLessons.ts':
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    days = re.findall(r'\b(?:day|"day")\s*:\s*(\d+)', c)
    unique_days = sorted(list(set(int(d) for d in days)))
    has_puzzle_prop = 'puzzle:' in c or '"puzzle":' in c
    courses_info.append({
        'file': fname,
        'course': fname.replace('LongLessons.ts', ''),
        'days': len(unique_days),
        'has_puzzle': has_puzzle_prop
    })
    total_days += len(unique_days)

print(f"Total courses: {len(courses_info)}, Total days: {total_days}")
with_puzzle = [c for c in courses_info if c['has_puzzle']]
print(f"Courses with explicit puzzle objects authored on disk: {len(with_puzzle)}")
for c in courses_info[:15]:
    print(f"  {c['course']:<25}: {c['days']} days | puzzle: {c['has_puzzle']}")
