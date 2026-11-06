import glob, re, os

files = glob.glob('src/lib/data/*LongLessons.ts')
print(f"Total LongLesson files found: {len(files)}")
over_30 = []
exactly_30 = []
under_30 = []

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    days = [int(x) for x in re.findall(r'["\']?day["\']?:\s*(\d+)', text)]
    if not days:
        continue
    m = max(days)
    base = os.path.basename(f)
    if m > 30:
        over_30.append((base, m))
    elif m == 30:
        exactly_30.append((base, m))
    else:
        under_30.append((base, m))

print(f"Courses with > 30 days: {len(over_30)}")
for f, m in over_30:
    print(f"  {f:40s}: {m} days")

print(f"\nCourses with exactly 30 days: {len(exactly_30)}")
print(f"Courses with < 30 days: {len(under_30)}")
for f, m in under_30[:10]:
    print(f"  {f:40s}: {m} days")
