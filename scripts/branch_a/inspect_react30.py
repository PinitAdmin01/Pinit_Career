with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
days = re.findall(r'day:\s*(\d+)', text)
if not days:
    days = re.findall(r'"day":\s*(\d+)', text)
print(f"react30DayData.ts total days found: {len(days)}")
print(text[:500])
