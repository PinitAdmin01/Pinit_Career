with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'day:\s*(2[1-5]),.*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)
for m in matches:
    print(f"Day {m[0]}: {m[1]}")
