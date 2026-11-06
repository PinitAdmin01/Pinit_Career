import sys
sys.path.insert(0, 'scripts')
from block4_day18 import DAY_18

wcs = [len(p['content'].strip().split()) for p in DAY_18['parts']]
print('Day 18 Word Counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
