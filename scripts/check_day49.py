import sys
sys.path.append('scripts')
from design_day49_data import DAY_49, count_words

print('Day 49 Title:', DAY_49['title'])
print('Parts count:', len(DAY_49['parts']))
for idx, p in enumerate(DAY_49['parts']):
    wc = count_words(p['say'])
    print(f"Part {idx+1}: {wc} words | title: {p['title']}")
