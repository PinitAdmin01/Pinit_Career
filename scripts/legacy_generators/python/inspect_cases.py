with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'case\s+[\'"][^\'"]+[\'"]:', text)
for m in matches:
    if 'acc' in m or 'bcom' in m:
        print(m)
