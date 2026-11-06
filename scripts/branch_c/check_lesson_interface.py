with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'export interface LongLesson', text)]
for pos in matches:
    print(text[pos:pos+1200])
