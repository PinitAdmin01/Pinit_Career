import re

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    txt = f.read()

m = re.search(r'[\'"]?day[\'"]?\s*:\s*36', txt)
if m:
    pos = m.start()
    print("Found day 36 at pos:", pos)
    print(txt[pos-100:pos+200])
else:
    print("Day 36 not found!")
