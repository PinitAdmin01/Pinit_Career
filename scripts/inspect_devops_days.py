import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

days = re.findall(r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"', content)
print(f"Total days found: {len(days)}")
for d, t in days:
    if int(d) >= 20:
        print(f"Day {d}: {t}")
