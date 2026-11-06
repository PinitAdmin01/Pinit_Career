with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'and verified its core production invariant.*?\)', text)
if m:
    print("Full match length:", len(m.group(0)))
    print("Match text:\n", m.group(0))
