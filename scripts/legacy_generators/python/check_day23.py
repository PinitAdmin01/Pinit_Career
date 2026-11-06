import sys
sys.path.insert(0, 'scripts')
from block5_day23 import DAY_23

wcs = [len(p['content'].strip().split()) for p in DAY_23['parts']]
print('Day 23 Word Counts:', wcs)
print('Total:', sum(wcs))
print('All >= 580:', all(w >= 580 for w in wcs))
for i, p in enumerate(DAY_23['parts']):
    print(f"Part {i+1}: {wcs[i]} words, Check Q: {p['check']['question'][:40]}... Ans: {p['check']['answer']}, Options count: {len(p['check']['options'])}")
