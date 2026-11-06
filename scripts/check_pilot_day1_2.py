with open('src/lib/data/pythonPilotDays.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
d1 = re.search(r'day:\s*1,.*?(?=day:\s*2)', text, re.DOTALL)
d2 = re.search(r'day:\s*2,.*?(?=day:\s*3)', text, re.DOTALL)

print("PYTHON PILOT DAY 1:")
if d1:
    print(d1.group(0)[:800])
    if 'return' in d1.group(0):
        print("\n-> FOUND 'return' in Python Pilot Day 1!")
        for l in d1.group(0).split('\n'):
            if 'return' in l:
                print("   ", l.strip())

print("\nPYTHON PILOT DAY 2:")
if d2:
    print(d2.group(0)[:800])
    if 'return' in d2.group(0):
        print("\n-> FOUND 'return' in Python Pilot Day 2!")
        for l in d2.group(0).split('\n'):
            if 'return' in l:
                print("   ", l.strip())
