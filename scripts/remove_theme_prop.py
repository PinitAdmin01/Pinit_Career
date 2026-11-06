with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Remove "theme": "...",\n
text = re.sub(r'\s*"theme":\s*"[^"]*",?\n', '\n', text)

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed all 'theme' properties from designWebLongLessons.ts!")
