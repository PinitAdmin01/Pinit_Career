import re

with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'[\'"]?day[\'"]?:\s*(\d+)', text)
print(f"Total days found: {len(days)}")
print(days)
