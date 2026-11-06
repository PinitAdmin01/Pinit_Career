import sys
sys.path.insert(0, 'scripts')
from block5_day21 import DAY_21

wcs = [len(p['content'].strip().split()) for p in DAY_21['parts']]
print('Day 21 Word Counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
