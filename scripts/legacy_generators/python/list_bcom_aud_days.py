import re

with open('src/lib/data/bcomAudLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

with open('src/lib/data/bcomAudLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r"['\"]?day['\"]?\s*:\s*(\d+)")
matches = pattern.findall(text)
print("All days found:", matches)
