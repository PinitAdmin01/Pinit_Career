with open('src/lib/data/bcomAccountingLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pos = text.rfind('day: 30')
if pos != -1:
    print(text[pos-100:pos+500])
