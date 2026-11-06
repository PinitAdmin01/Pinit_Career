import sys
sys.path.insert(0, 'scripts')
from block5_day22 import DAY_22

wcs = [len(p['content'].strip().split()) for p in DAY_22['parts']]
print('Day 22 Word Counts:', wcs)
print('Total:', sum(wcs))
print('All >= 580:', all(w >= 580 for w in wcs))
for i, p in enumerate(DAY_22['parts']):
    print(f"Part {i+1}: {wcs[i]} words, Check Q: {p['check']['question'][:40]}... Ans: {p['check']['answer']}, Options count: {len(p['check']['options'])}")
