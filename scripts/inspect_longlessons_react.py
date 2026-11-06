with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [line for line in text.splitlines() if 'react' in line.lower() or 'REACT' in line]
for m in matches:
    print(m)
