import json
import re

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for day in range(16, 21):
    m = re.search(r'\n  \{\s*["\']?day["\']?:\s*' + str(day) + r'\s*,', text)
    if m:
        # find title
        start = m.start()
        sub = text[start:start+1000]
        tm = re.search(r'["\']?title["\']?:\s*["\']([^"\']+)["\']', sub)
        title = tm.group(1) if tm else "NO TITLE"
        print(f"Day {day}: start_idx={start}, title='{title}'")
    else:
        print(f"Day {day}: NOT FOUND")
