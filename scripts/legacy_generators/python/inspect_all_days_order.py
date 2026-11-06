with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'\{\s*["\']?day["\']?:\s*(\d+)\s*,', text)
print("All days in javaBasicsLongLessons in order:")
print(matches)
