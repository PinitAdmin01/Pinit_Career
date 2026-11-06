import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/computerFundamentalsPilotDays.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'\{\s*"day":\s*(\d+),\s*"title":\s*"([^"]+)"'
matches = re.findall(pattern, text)
seen = set()
for d, title in matches:
    if d not in seen and 12 <= int(d) <= 30:
        seen.add(d)
        print(f"Day {d}: {title}")
