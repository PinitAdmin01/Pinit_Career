import sys, json
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/softSkills30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pattern = r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"'
matches = re.findall(pattern, text)
print(f"Total Configs in softSkills30DayData.ts: {len(matches)}")
for day, title in matches:
    print(f"Day {int(day):2d}: {title}")
