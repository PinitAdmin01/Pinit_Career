import glob, os, re

files = glob.glob('src/lib/data/*LongLessons.ts')
print(f"Total LongLesson files found: {len(files)}")

report = []
for fpath in sorted(files):
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        text = f.read()
    days = re.findall(r'[\'"]day[\'"]:\s*(\d+)', text)
    unique_days = sorted(list(set(int(d) for d in days)))
    max_d = max(unique_days) if unique_days else 0
    cnt = len(unique_days)
    report.append((cnt, max_d, fname))

for cnt, max_d, fname in sorted(report, key=lambda x: x[0]):
    print(f"{fname:32s}: {cnt:2d} days (max Day {max_d:2d})")
