with open('src/lib/data/pythonPilotDays.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
d2_idx = text.find('"day": 2')
if d2_idx != -1:
    d2_text = text[d2_idx:d2_idx+6000]
    print("DAY 2 TITLE & OVERVIEW:")
    lines = d2_text.split('\n')
    for l in lines[:20]:
        print(" ", l)
    
    if 'return' in d2_text:
        print("\n--> FOUND 'return' in Python Day 2!")
        for l in lines:
            if 'return' in l:
                print("   [LINE]:", l.strip())
else:
    print("Could not find Day 2!")
