with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
print("=== TEMPLATE STEP VALIDATION IN GATE.TS ===")
for t in ['tree-graph', 'table', 'bars', 'cells', 'stack-queue']:
    m = re.findall(rf"case '{t}':.*?(?=break;)", text, re.DOTALL)
    if m:
        print(f"--- {t} ---")
        print(m[0].strip()[:500])
