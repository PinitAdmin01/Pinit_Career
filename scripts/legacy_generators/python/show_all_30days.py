import re

with open('src/lib/data/iotNetwork30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
for d, t in days:
    safe_t = t.encode('ascii', errors='replace').decode('ascii')
    print(f"Day {d}: {safe_t}")
