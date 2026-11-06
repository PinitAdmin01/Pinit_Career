import glob
import os
import re

files = glob.glob('src/lib/data/*LongLessons.ts')
print("Course files with count < 30 or count not in (30, 60):")
for f in sorted(files):
    base = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    days = re.findall(r'\bday\s*:\s*(\d+)|\"day\"\s*:\s*(\d+)', text)
    count = len(days)
    if count not in (30, 60):
        print(f"  {base:35} | count = {count}")
