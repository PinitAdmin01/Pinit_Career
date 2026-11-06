import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

chunks = text.split('"day":')

for d in range(11, 21):
    for i in range(1, len(chunks)):
        if re.match(r'^\s*' + str(d) + r'\b', chunks[i]):
            prev = chunks[i-1]
            title = re.findall(r'"title":\s*"([^"]+)"', prev)[-1]
            etitle = re.findall(r'"eTitle":\s*"([^"]+)"', prev)[-1]
            atitle = re.findall(r'"aTitle":\s*"([^"]+)"', prev)[-1]
            print(f"Day {d}:")
            print(f"  Title: {title}")
            print(f"  eTitle: {etitle}")
            print(f"  aTitle: {atitle}")
            break
