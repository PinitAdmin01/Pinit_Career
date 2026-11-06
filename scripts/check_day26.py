import sys
sys.path.insert(0, 'scripts')
from block6_day26 import DAY_26

wcs = [len(p['content'].strip().split()) for p in DAY_26['parts']]
print('Day 26 Word Counts:', wcs)
print('Total:', sum(wcs))
print('All >= 580:', all(w >= 580 for w in wcs))
for i, p in enumerate(DAY_26['parts']):
    print(f"Part {i+1}: {wcs[i]} words, Code len: {len(p['code'])}, Checks: {len(p['checks'])}")
