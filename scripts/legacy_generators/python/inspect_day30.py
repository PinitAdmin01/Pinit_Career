import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find Day 30
idx = text.find('"day": 30')
if idx != -1:
    print(text[idx:idx+2500])
else:
    print("Day 30 not found, trying day: 30")
    idx2 = text.find('day: 30')
    if idx2 != -1:
        print(text[idx2:idx2+2500])
    else:
        print("Not found")
