import sys
sys.path.insert(0, 'scripts')
from block4_day16 import DAY_16
from block4_day17 import DAY_17
from block4_day18 import DAY_18
from block4_day19 import DAY_19
from block4_day20 import DAY_20

days = [DAY_16, DAY_17, DAY_18, DAY_19, DAY_20]
all_pass = True

print("=== BLOCK 4 (DAYS 16 TO 20) GROUND-TRUTH AUDIT ===")
for d in days:
    wcs = [len(p['content'].strip().split()) for p in d['parts']]
    checks_valid = all(len(p['checks']) == 4 and all(c['answer'] == 0 and len(c['options']) == 4 for c in p['checks']) for p in d['parts'])
    code_valid = all(len(p.get('code', '').strip()) > 50 for p in d['parts'])
    parts_valid = all(w >= 580 for w in wcs) and len(wcs) == 5
    day_pass = parts_valid and checks_valid and code_valid and sum(wcs) >= 2900
    if not day_pass:
        all_pass = False
    print(f"Day {d['day']}: Total={sum(wcs)}, Parts={wcs}, All >= 580: {parts_valid}, Checks Valid: {checks_valid}, Code: {code_valid} -> PASS: {day_pass}")

print(f"\nOVERALL BLOCK 4 AUDIT PASS: {all_pass}")
