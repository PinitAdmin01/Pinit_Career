with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m26 = re.search(r'\n  \{\s*["\']?day["\']?:\s*26\s*,', text)
m31 = re.search(r'\n  \{\s*["\']?day["\']?:\s*31\s*,', text)

block = text[m26.start():m31.start()]
days_found = re.findall(r'["\']?day["\']?:\s*(\d+)', block)
print("Days found between Day 26 and Day 31:", days_found)
