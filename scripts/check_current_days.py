import re

with open('src/lib/data/iotEdgeLongLessons.ts', 'r', encoding='utf-8') as f:
    c = f.read()

days = [int(x) for x in re.findall(r'["\']?day["\']?:\s*(\d+)', c)]
print("Found days in iotEdgeLongLessons.ts:", sorted(set(days)))
print("Total day entries:", len(days))
