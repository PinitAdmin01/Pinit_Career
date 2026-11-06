with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'AI_WEB_LONG_LESSONS', text)]
for pos in matches:
    print(text[max(0, pos-200):min(len(text), pos+400)])
    print("="*60)
