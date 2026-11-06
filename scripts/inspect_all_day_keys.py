with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find day numbers and part keys
days = [1, 5, 6, 10, 11, 15, 16, 20, 21, 25, 26, 30, 31, 60]
for d in days:
    m = re.search(r'\{\s*["\']?day["\']?:\s*' + str(d) + r',[\s\S]*?"parts":\s*\[\s*\{([\s\S]*?)\}', text)
    if m:
        keys = re.findall(r'"([a-zA-Z0-9_]+)":', m.group(1))
        print(f"Day {d} Part 1 keys:", keys)
    else:
        print(f"Day {d} not matched")
