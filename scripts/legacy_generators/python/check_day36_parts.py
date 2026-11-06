import sys
from design_day36_data import DAY_36, count_words

for i, p in enumerate(DAY_36['parts']):
    words = count_words(p['say'])
    print(f"Day 36 Part {i+1}: {words} words")
