with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m26 = re.search(r'\n  \{\s*["\']?day["\']?:\s*26\s*,', text)
m31 = re.search(r'\n  \{\s*["\']?day["\']?:\s*31\s*,', text)

print("Day 26 index:", m26.start() if m26 else "Not found")
print("Day 31 index:", m31.start() if m31 else "Not found")
if m26:
    print("Day 26 snippet:", text[m26.start():m26.start()+150])
if m31:
    print("Day 31 snippet:", text[m31.start():m31.start()+150])
