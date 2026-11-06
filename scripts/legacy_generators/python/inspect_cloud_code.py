import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'\"code\":\s*\"([^\"]+)\"', text)
if m:
    print("Sample code snippet string:")
    print(m.group(1).encode('utf-8').decode('unicode_escape'))
