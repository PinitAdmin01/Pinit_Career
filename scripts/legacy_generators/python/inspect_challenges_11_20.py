import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for d in range(11, 21):
    m = re.search(r'("title":\s*"[^"]*",[\s\S]*?"eTitle":\s*"[^"]*",[\s\S]*?"aTitle":\s*"[^"]*",[\s\S]*?"day":\s*' + str(d) + r'\b)', text)
    if m:
        block = m.group(1)
        title = re.search(r'"title":\s*"([^"]*)"', block).group(1)
        etitle = re.search(r'"eTitle":\s*"([^"]*)"', block).group(1)
        atitle = re.search(r'"aTitle":\s*"([^"]*)"', block).group(1)
        print(f"Day {d}:")
        print(f"  Title: {title}")
        print(f"  eTitle: {etitle}")
        print(f"  aTitle: {atitle}")
