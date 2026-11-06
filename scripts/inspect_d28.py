with open('src/lib/data/iotNetwork30DayData.ts', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'\{\s*"day":\s*(2[6-9]|30),.*?(?=\n  \{|\n\];)', text, re.DOTALL)
for m in matches:
    print(f"=== DAY {m.group(1)} CONFIG ===")
    lines = m.group(0).split('\n')
    for l in lines[:10]:
        print(l.encode('ascii', errors='replace').decode('ascii'))
