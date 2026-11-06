with open('src/lib/data/java30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pattern = r'day:\s*(\d+),\s*title:\s*["\']([^"\']+)["\'],\s*description:\s*["\']([^"\']+)["\']'
matches = re.findall(pattern, text)
for m in matches:
    if 21 <= int(m[0]) <= 30:
        print(f"Day {m[0]}: {m[1]} -> {m[2]}")
