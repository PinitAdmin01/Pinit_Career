with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'day:\s*(2[6-9]|30)', text)
print("Found days in javaBasicsLongLessons:", matches)

# Check index of day 26 and day 31
idx26 = text.find('"day": 26')
if idx26 == -1:
    idx26 = text.find('day: 26')

idx31 = text.find('"day": 31')
if idx31 == -1:
    idx31 = text.find('day: 31')

print("idx26:", idx26)
print("idx31:", idx31)
