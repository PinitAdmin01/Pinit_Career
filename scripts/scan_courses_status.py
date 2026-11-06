import glob
import re

files = glob.glob('src/lib/data/*LongLessons.ts')
for f in sorted(files):
    with open(f, 'r', encoding='utf-8') as fl:
        content = fl.read()
    days = re.findall(r'day["\']?\s*:\s*(\d+)', content)
    unique_days = sorted(list(set(int(d) for d in days)))
    fname = f.replace('src/lib/data/', '')
    max_d = max(unique_days) if unique_days else 0
    print(f"{fname:38} | Total: {len(unique_days):2} | Max: {max_d:2}")
