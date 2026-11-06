with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m_day6 = re.search(r'\n  \{\s*["\']?day["\']?:\s*6\s*,', text)
m_day21 = re.search(r'\n  \{\s*["\']?day["\']?:\s*21\s*,', text)

print("Day 6 index:", m_day6.start() if m_day6 else "NOT FOUND")
print("Day 21 index:", m_day21.start() if m_day21 else "NOT FOUND")
if m_day6:
    print("Day 6 start snippet:", text[m_day6.start():m_day6.start()+150])
if m_day21:
    print("Day 21 start snippet:", text[m_day21.start():m_day21.start()+150])
