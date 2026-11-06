with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for d in range(1, 6):
    m = re.search(r'\{\s*["\']?day["\']?:\s*' + str(d) + r'\b[\s\S]*?"minutes":\s*(\d+)', text)
    if m:
        print(f"Day {d} minutes:", m.group(1))
