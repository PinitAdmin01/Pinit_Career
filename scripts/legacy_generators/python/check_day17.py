import sys
sys.path.insert(0, 'scripts')
from block4_day17 import DAY_17

wcs = [len(p['content'].strip().split()) for p in DAY_17['parts']]
print('Day 17 Word Counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
