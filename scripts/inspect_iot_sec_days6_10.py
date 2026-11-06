with open('src/lib/data/iotSecurity30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
for d, t in matches:
    if 6 <= int(d) <= 15:
        print(f"Day {d}: {t}")
