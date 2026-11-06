with open('src/lib/visuals/loadVisuals.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("loadVisuals.ts length:", len(text))
import re
m = re.search(r'export function loadDayFile[\s\S]*?\{([\s\S]*?)\n\}', text)
if m:
    print("loadDayFile:", m.group(0)[:600])
