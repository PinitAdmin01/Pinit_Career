import glob
import os
import re

files = glob.glob('src/lib/data/*LongLessons.ts')
print("5-day placeholder courses in main workspace:")
for f in sorted(files):
    base = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    days = re.findall(r'\bday\s*:\s*(\d+)|\"day\"\s*:\s*(\d+)', text)
    count = len(days)
    if count == 5:
        print(f"  - {base}")
