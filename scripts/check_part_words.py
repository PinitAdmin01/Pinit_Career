import sys
import os

sys.path.append(os.path.join(os.getcwd(), 'scripts'))
from day31_data import d31
from day32_data import d32
from day33_data import d33
from day34_data import d34
from day35_data import d35

days = [d31, d32, d33, d34, d35]

for d in days:
    print(f"\n--- Day {d['day']}: {d['title']} ---")
    day_words = 0
    for idx, p in enumerate(d["parts"]):
        words = len(" ".join(p["say"]).split())
        print(f"  Part {idx+1} ({p['title'][:40]}...): {words} words")
        day_words += words
    spoken = round(day_words / 120)
    print(f"Total Day {d['day']}: {day_words} words ({spoken} spoken min, {spoken+10} total min)")
