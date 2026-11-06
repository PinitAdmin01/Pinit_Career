with open('src/lib/data/gitVcsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"day":\s*(\d+)', text)
print('JSON-style days:', matches)
matches2 = re.findall(r'day:\s*(\d+)', text)
print('TS-style days:', matches2)

# Check the last 1500 chars of Day 15
idx = text.rfind('"day": 15')
if idx != -1:
    print("Found Day 15 at", idx)
    print(text[idx+len(text[idx:]):])
    print("Snippet:")
    print(text[idx:][-1200:])
