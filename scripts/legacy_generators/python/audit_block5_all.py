import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, 'scripts')

from block5_day21 import DAY_21
from block5_day22 import DAY_22
from block5_day23 import DAY_23
from block5_day24 import DAY_24
from block5_day25 import DAY_25

days = [DAY_21, DAY_22, DAY_23, DAY_24, DAY_25]
all_ok = True

print("==================== BLOCK 5 (DAYS 21-25) AUDIT ====================")
for d in days:
    wcs = [len(p['content'].strip().split()) for p in d['parts']]
    total = sum(wcs)
    parts_ok = all(w >= 580 for w in wcs)
    checks_ok = True
    for p in d['parts']:
        chk = p.get('check')
        if not chk and 'checks' in p:
            chk = p['checks'][0]
        if not (chk and len(chk['options']) == 4 and chk['answer'] == 0):
            checks_ok = False
            print(f"  FAILED CHECK in part: {p.get('title')}: {chk}")

    print(f"Day {d['day']}: {d['title']}")
    print(f"  Word Counts: {wcs} (Total: {total}) -> Parts >= 580: {parts_ok}")
    print(f"  Checks Valid (4 options, answer=0): {checks_ok}")
    if not (parts_ok and checks_ok):
        all_ok = False

print(f"\nBLOCK 5 OVERALL PASSED: {all_ok}")
