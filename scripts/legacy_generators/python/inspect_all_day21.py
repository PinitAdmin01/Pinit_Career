with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'\{\s*["\']?day["\']?:\s*21\s*,', text))
print(f"Total occurrences of Day 21: {len(matches)}")
for m in matches:
    print(f"Occurrence at index {m.start()}:")
    print(text[m.start():m.start()+250])
