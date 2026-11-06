import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each day block
days = re.findall(r'\{\s*"title":\s*"([^"]+)",\s*"desc":\s*"([^"]+)",.*?"eTitle":\s*"([^"]+)",.*?"eDesc":\s*"([^"]+)",.*?"day":\s*(\d+)', text, re.DOTALL)

for title, desc, etitle, edesc, day in sorted(days, key=lambda x: int(x[4])):
    print(f"Day {int(day):02d}:")
    print(f"   Title:     {title}")
    print(f"   Desc:      {desc[:60]}...")
    print(f"   Challenge: {etitle}")
    print(f"   C-Desc:    {edesc[:60]}...")
