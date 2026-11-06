# scripts/audit_all_longlessons_branch_a.py
import os, glob, re

files = glob.glob('src/lib/data/*LongLessons.ts')
print(f"Total LongLessons files in Branch A: {len(files)}")

summary = []
for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    days = re.findall(r'"day":\s*(\d+)', content)
    day_count = len(days)
    max_day = max([int(d) for d in days]) if days else 0
    prefix_match = re.search(r'"coursePrefix":\s*"([^"]+)"', content)
    prefix = prefix_match.group(1) if prefix_match else 'unknown'
    summary.append((os.path.basename(f), prefix, day_count, max_day))

for name, prefix, count, max_d in summary:
    print(f"{name:<38} | prefix: {prefix:<15} | days: {count:<3} | max_day: {max_d}")
