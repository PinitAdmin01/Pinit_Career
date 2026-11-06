with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
titles = re.findall(r'title:\s*["\'](.*?)["\']', text)
print(f"Titles found in react30DayData.ts: {len(titles)}")
for i, t in enumerate(titles[:10]):
    print(f"  Day {i+1}: {t}")
