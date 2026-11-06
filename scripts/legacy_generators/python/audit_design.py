import re

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = sorted(list(set(int(x) for x in re.findall(r'(?:["\']day["\']|day)\s*:\s*(\d+)', text))))
print("Count of days:", len(days))
print("Days:", days)
