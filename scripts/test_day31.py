import sys
sys.stdout.reconfigure(encoding='utf-8')
from react_day31_data import day31

print(f"Day {day31['day']}: {day31['title']}")
total_words = 0
for i, p in enumerate(day31['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Part {i+1} ({p['title'][:35]}...): words={wc}")

print(f"Total words: {total_words}")
