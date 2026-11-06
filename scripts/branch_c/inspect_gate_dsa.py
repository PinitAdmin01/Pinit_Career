with open("src/lib/visuals/gate.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
idx = text.find("'dsa-optim'")
if idx == -1:
    idx = text.find('"dsa-optim"')

if idx != -1:
    print(text[idx-50:idx+200])
else:
    print("dsa-optim not found directly, checking template rules")
    m = re.findall(r'ALLOWED_TEMPLATES.*?;', text, re.DOTALL)
    for match in m:
        print(match[:500])
