import os
import sys
import json

sys.path.insert(0, os.path.abspath('scripts'))

from react_day41_data import day41
from react_day42_data import day42
from react_day43_data import day43
from react_day44_data import day44
from react_day45_data import day45

days = [day41, day42, day43, day44, day45]

print("================ BLOCK 9 CURRICULUM AUDIT ================")
all_pass = True
for d in days:
    day_num = d['day']
    title = d['title']
    minutes = d['minutes']
    parts = d['parts']
    print(f"\n--- DAY {day_num}: {title} (Minutes: {minutes}) ---")
    if day_num < 45:
        if minutes != 38:
            print(f"ERROR: Day {day_num} minutes is {minutes}, expected 38")
            all_pass = False
    else:
        if minutes != 40:
            print(f"ERROR: Day 45 minutes is {minutes}, expected 40")
            all_pass = False

    total_words = 0
    for p_idx, p in enumerate(parts):
        w = sum(len(s.split()) for s in p['say'])
        total_words += w
        print(f"  Part {p_idx+1} ({p['title'][:38]}...): {w} words")
        if w < 580:
            print(f"  FAILED: Part {p_idx+1} word count {w} < 580")
            all_pass = False

    print(f"  Total Day {day_num} words: {total_words}")
    if total_words < 2900:
        print(f"  FAILED: Total words {total_words} < 2900")
        all_pass = False

if all_pass:
    print("\nALL 5 DAYS (41-45) WORD COUNTS & INVARIANTS 100% PASSED!")
else:
    print("\nSOME INVARIANTS FAILED!")
    sys.exit(1)
