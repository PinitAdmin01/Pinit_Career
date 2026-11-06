# scripts/check_all_courses.py
import glob
import re
import os

files = glob.glob('src/lib/data/*LongLessons*.ts')
for f in sorted(files):
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    days = [int(x) for x in re.findall(r'"day":\s*(\d+)', c)]
    if days:
        print(f"{os.path.basename(f):<40}: count={len(days):2d}, range={min(days):2d}..{max(days):2d}")
    else:
        print(f"{os.path.basename(f):<40}: NO DAYS FOUND")
