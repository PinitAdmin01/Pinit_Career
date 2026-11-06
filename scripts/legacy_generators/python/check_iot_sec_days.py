import re

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

matches = [int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt)]
print("Unique days count:", len(set(matches)))
print("List of unique days:", sorted(set(matches)))
print("Total occurrences of day:", len(matches))
