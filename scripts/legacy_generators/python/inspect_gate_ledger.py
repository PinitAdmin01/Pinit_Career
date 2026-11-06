with open('src/lib/visuals/gate.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'case\s+[\'"]ledger-sheet[\'"]:[^}]+}', text)
for m in matches:
    print(m[:300])
