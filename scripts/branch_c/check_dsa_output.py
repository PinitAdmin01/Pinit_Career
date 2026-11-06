with open("src/lib/data/dsaWebLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
m = re.search(r'"day":\s*30,.*?"output":\s*"(.*?)"', text, re.DOTALL)
if m:
    print("Day 30 output:")
    print(m.group(1).replace("\\n", "\n"))
