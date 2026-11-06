with open('src/lib/data/bcomAccountingLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
days = re.findall(r'[\'"]?day[\'"]?:\s*(\d+)', text)
print('Total days found:', len(days))
print('Days list:', [int(d) for d in days])
