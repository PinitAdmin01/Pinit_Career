import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import json
# Let's count how many parts each day has in cloudWebLongLessons.ts
import re
day_blocks = re.split(r'\{\s*\"day\":\s*\d+', text)
print("Found day blocks:", len(day_blocks))
for d in range(1, 31):
    m = re.search(r'\"day\":\s*' + str(d) + r'[\s\S]*?\"parts\":\s*\[([\s\S]*?)\]\s*,\s*\"summary\"', text)
    if m:
        # count title inside parts
        titles = re.findall(r'\"title\":\s*\"([^\"]+)\"', m.group(1))
        if d in [1, 2, 3, 29, 30]:
            print(f"Day {d} parts count: {len(titles)}")
