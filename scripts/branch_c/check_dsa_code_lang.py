with open("src/lib/data/dsaWebLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
m = re.search(r'"day":\s*30,.*?"code":\s*"(.*?)",\s*"output"', text, re.DOTALL)
if m:
    print("Day 30 code snippet:")
    print(m.group(1)[:300].replace("\\n", "\n"))
