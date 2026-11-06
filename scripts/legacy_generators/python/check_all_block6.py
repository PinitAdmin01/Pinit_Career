import sys
sys.path.append('scripts')

from block6_day26 import DAY_26
from block6_day27 import DAY_27
from block6_day28 import DAY_28
from block6_day29 import DAY_29
from block6_day30 import DAY_30

days = [DAY_26, DAY_27, DAY_28, DAY_29, DAY_30]

print("=== CHECKING ALL BLOCK 6 DAYS (26 to 30) ===")
overall_ok = True

for d in days:
    day_num = d.get('day')
    title = d.get('title')
    parts = d.get('parts', [])
    wcs = [len(p['content'].split()) for p in parts]
    total_w = sum(wcs)
    all_parts_ok = all(wc >= 580 for wc in wcs) and len(parts) == 5
    
    checks_ok = True
    codes_ok = True
    for idx, p in enumerate(parts):
        checks = p.get('checks') or p.get('conceptChecks') or []
        if len(checks) != 4:
            checks_ok = False
        for c in checks:
            if c.get('answer') != 0 or len(c.get('options', [])) != 4 or len(c.get('explanation', '')) <= 20:
                checks_ok = False
        if len(p.get('code', '')) <= 50:
            codes_ok = False
            
    print(f"Day {day_num}: '{title}'")
    print(f"  Word counts: {wcs} (Total: {total_w})")
    print(f"  >= 580/part: {all_parts_ok} | Checks OK: {checks_ok} | Code OK: {codes_ok}")
    
    if not (all_parts_ok and checks_ok and codes_ok):
        overall_ok = False

print(f"\nOVERALL BLOCK 6 STATUS: {'100% PASS' if overall_ok else 'FAIL'}")
