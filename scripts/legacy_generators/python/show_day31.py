with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'day:\s*31\b', text)]
idx = matches[0]
sample = text[idx:idx+1500]
print(sample)
