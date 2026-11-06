with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m_day6 = re.search(r'\n  \{\s*["\']?day["\']?:\s*6\s*,', text)
m_day21 = re.search(r'\n  \{\s*["\']?day["\']?:\s*21\s*,', text)

block = text[m_day6.start():m_day21.start()]
days = re.findall(r'["\']?day["\']?:\s*(\d+)', block)
print("Days between Day 6 and Day 21:", days)
