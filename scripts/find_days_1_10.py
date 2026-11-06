with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for d in range(1, 10):
    m = re.search(r'["\']?day["\']?:\s*' + str(d) + r'\b', text)
    if m:
        print(f"Day {d} found at index {m.start()}: {text[m.start():m.start()+60]}")
    else:
        print(f"Day {d} NOT FOUND")
