with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'\{\s*["\']?day["\']?:\s*31,[\s\S]*?"parts":\s*\[\s*\{([\s\S]*?)\}', text)
if m:
    lines = m.group(1).splitlines()
    for l in lines[:40]:
        print(l)
