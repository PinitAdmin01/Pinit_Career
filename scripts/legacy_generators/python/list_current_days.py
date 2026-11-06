import re

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print("Found days:", days)
