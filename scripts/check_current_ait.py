import re

with open('src/lib/data/bcomAitLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = sorted(list(set(map(int, re.findall(r'"day":\s*(\d+)', text)))))
print(f"Days currently in bcomAitLongLessons.ts: {days}")
