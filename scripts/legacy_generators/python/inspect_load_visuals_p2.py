with open('src/lib/visuals/loadVisuals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export function loadDayFile[\s\S]*?\{([\s\S]*?)\n\}', text)
if m:
    print(m.group(1)[500:1500])
