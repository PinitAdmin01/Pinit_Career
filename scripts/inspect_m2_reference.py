# scripts/inspect_m2_reference.py
import re

with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
m2_days = [d for d in days if int(d[0]) >= 31]
print(f"Found {len(m2_days)} Month 2 days in iotSecLongLessons.ts:")
for d, title in m2_days[:15]:
    print(f"  Day {d}: {title}")
