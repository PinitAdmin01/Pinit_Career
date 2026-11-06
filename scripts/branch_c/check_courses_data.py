with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'AI_WEB', text)]
print("AI_WEB matches in coursesData.ts:", len(matches))
for pos in matches:
    print(text[max(0, pos-200):min(len(text), pos+400)])
    print("="*60)
