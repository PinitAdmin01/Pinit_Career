import sys
sys.path.insert(0, 'scripts')
from block5_day21 import DAY_21
from block5_day22 import DAY_22
from block5_day23 import DAY_23
from block5_day24 import DAY_24
from block5_day25 import DAY_25

days = [DAY_21, DAY_22, DAY_23, DAY_24, DAY_25]

for d in days:
    print(f"=== Day {d['day']} ===")
    for idx, p in enumerate(d['parts']):
        code = p.get('code')
        checks = p.get('checks')
        check = p.get('check')
        print(f"  Part {idx+1}: has code: {bool(code)} (len: {len(code) if code else 0}), has checks: {len(checks) if checks else 0}, has check: {bool(check)}")
