import sys
sys.path.insert(0, 'scripts')
from block6_day27 import DAY_27

wcs = [len(p['content'].strip().split()) for p in DAY_27['parts']]
print('Day 27 Word Counts:', wcs)
print('Total:', sum(wcs))
print('All >= 580:', all(w >= 580 for w in wcs))
for i, p in enumerate(DAY_27['parts']):
    print(f"Part {i+1}: {wcs[i]} words, Code len: {len(p['code'])}, Checks: {len(p['checks'])}")
