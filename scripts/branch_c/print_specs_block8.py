with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/visuals/ai-prompt-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for day in [36, 37, 38, 39, 40]:
    pattern = r'\{\s*"day":\s*' + str(day) + r',[\s\S]*?\n  \}'
    m = re.search(pattern, text)
    if m:
        print(f"=== SPEC DAY {day} ===")
        print(m.group(0))
    else:
        print(f"=== SPEC DAY {day} NOT FOUND ===")
