with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/visuals/ai-prompt-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Look for quest or day 36
for line in text.splitlines():
    if '36' in line and ('Day' in line or 'day' in line or 'Q36' in line):
        print(line[:120])
