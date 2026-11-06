import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

with open('src/lib/data/computerFundamentalsPilotDays.ts', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'\{\s*"day":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
for d, t in matches[:20]:
    print(f"Day {d}: {t}")
