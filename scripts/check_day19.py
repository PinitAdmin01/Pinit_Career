import sys
sys.path.insert(0, 'scripts')
from block4_day19 import DAY_19

wcs = [len(p['content'].strip().split()) for p in DAY_19['parts']]
print('Day 19 Word Counts:', wcs, 'Total:', sum(wcs), 'All >= 580:', all(w >= 580 for w in wcs))
