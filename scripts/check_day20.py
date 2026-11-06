import sys
sys.path.insert(0, 'scripts')
from block4_day20 import DAY_20

wcs = [len(p['content'].strip().split()) for p in DAY_20['parts']]
print('Day 20 Word Counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
