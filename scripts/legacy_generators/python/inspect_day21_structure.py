with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'("day":\s*21,[\s\S]*?"title":\s*"[^"]*",[\s\S]*?"parts":\s*\[\s*\{[\s\S]*?"title":\s*"[^"]*",[\s\S]*?\})', text)
if m:
    print(m.group(1)[:600])
