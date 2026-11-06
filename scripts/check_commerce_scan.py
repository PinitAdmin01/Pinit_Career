import subprocess
import glob
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
files = glob.glob(os.path.join(commerce_dir, 'src/lib/data/*LongLessons.ts'))
for f in sorted(files):
    base = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    # count day entries
    import re
    days = re.findall(r'\bday\s*:\s*(\d+)|\"day\"\s*:\s*(\d+)', text)
    count = len(days)
    day_nums = [int(a or b) for a, b in days]
    max_day = max(day_nums) if day_nums else 0
    print(f"{base:35} | Total: {count:2} | Max: {max_day:2}")
