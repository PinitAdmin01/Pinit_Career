with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Has say as array?:", 'say: [' in text)
matches = list(re.finditer(r'day:\s*(\d+)', text))
if matches:
    print("Latest day found in file:", matches[-1].group(1))

# Let's inspect day 50 part 1
pos = text.find("day: 50")
if pos != -1:
    print("Day 50 snippet:\n", text[pos:pos+500])
