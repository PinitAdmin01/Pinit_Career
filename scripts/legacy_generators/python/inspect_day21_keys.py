with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'("day":\s*21,[\s\S]*?"parts":\s*\[\s*\{[\s\S]*?\}\s*\]\s*\})', text)
if m:
    lines = m.group(1).splitlines()
    for l in lines[:45]:
        print(l)
