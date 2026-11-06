with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'export function estimateSpokenMinutes[\s\S]*?\{([\s\S]*?)\n\}', text)
if m:
    print(m.group(0))
