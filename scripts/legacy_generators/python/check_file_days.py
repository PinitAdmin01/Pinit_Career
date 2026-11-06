import re

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print(f"Total days in iotSecLongLessons.ts: {len(days)} -> {days}")
