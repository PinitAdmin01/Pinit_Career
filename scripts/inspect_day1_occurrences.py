with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'\{\s*["\']?day["\']?:\s*1\s*,[\s\S]*?"title":\s*"([^"]+)"', text)
if m:
    print("Day 1 Title:", m.group(1))

# Search all occurrences of day 1 in javaBasicsLongLessons
matches = list(re.finditer(r'\{\s*["\']?day["\']?:\s*1\s*,', text))
print("Total occurrences of 'day': 1 ->", len(matches))
for i, match in enumerate(matches):
    print(f"Occurrence {i+1} at index {match.start()}:")
    print(text[match.start():match.start()+200])
