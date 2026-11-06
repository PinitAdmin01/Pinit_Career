import json
import re

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
print("Day list:", days)
