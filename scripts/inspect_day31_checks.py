with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

m = re.search(r'\{\s*["\']?day["\']?:\s*31,[\s\S]*?"parts":\s*\[\s*\{([\s\S]*?)\}\s*,\s*\{', text)
if m:
    print("checks" in m.group(1))
    print("conceptChecks" in m.group(1))
    for line in m.group(1).splitlines():
        if "check" in line.lower():
            print("check line:", line)
