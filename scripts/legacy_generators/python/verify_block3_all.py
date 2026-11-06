import sys
sys.path.insert(0, 'scripts')
from block3_day11 import DAY_11
from block3_day12 import DAY_12
from block3_day13 import DAY_13
from block3_day14 import DAY_14
from block3_day15 import DAY_15

days = [DAY_11, DAY_12, DAY_13, DAY_14, DAY_15]
all_pass = True
for d in days:
    wcs = [len(p['content'].strip().split()) for p in d['parts']]
    checks_valid = all(len(p['checks']) == 4 and all(c['answer'] == 0 for c in p['checks']) for p in d['parts'])
    pass_part = all(w >= 580 for w in wcs)
    if not (pass_part and checks_valid):
        all_pass = False
    print(f"Day {d['day']}: Total={sum(wcs)}, Parts={wcs}, All >= 580: {pass_part}, Checks Valid: {checks_valid}")

print(f"\nOVERALL BLOCK 3 AUDIT PASS: {all_pass}")
