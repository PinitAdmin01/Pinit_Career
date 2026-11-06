import json
import os
import sys

sys.path.append(os.path.join(os.getcwd(), 'scripts'))

from day31_data import d31
from day32_data import day32 as d32
from day33_data import day33 as d33
from day34_data import day34 as d34
from day35_data import day35 as d35

days = [d31, d32, d33, d34, d35]

def verify_lesson(lesson):
    day_num = lesson["day"]
    title = lesson["title"].encode('ascii', 'ignore').decode('ascii')
    parts = lesson["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts"
    
    total_words = 0
    print(f"\n--- Day {day_num}: {title} ---")
    for idx, p in enumerate(parts):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
        words = len(say_text.split())
        total_words += words
        safe_title = p['title'][:40].encode('ascii', 'ignore').decode('ascii')
        print(f"  Part {idx+1}: {words} words ({safe_title}...)")
        assert words >= 580, f"Part {idx+1} has {words} words, must be >= 580"
    
    spoken = round(total_words / 120)
    total_min = spoken + 10
    print(f"Total Day {day_num}: {total_words} words ({spoken} spoken min, {total_min} total min)")
    assert spoken >= 20, f"Spoken minutes must be >= 20, got {spoken}"
    assert total_min >= 35 and total_min <= 40, f"Total minutes must be 35-40, got {total_min}"
    return total_words

total_batch_words = 0
for d in days:
    total_batch_words += verify_lesson(d)

print(f"\n=======================================================")
print(f"TOTAL BATCH 1 WORDS ACROSS DAYS 31-35: {total_batch_words} words")
print(f"AVERAGE WORDS PER DAY: {total_batch_words / 5:.1f} words/day")
print(f"AVERAGE SPOKEN MINUTES: {(total_batch_words / 5) / 120:.1f} min/day")
print(f"ALL 25 PARTS STRICTLY >= 580 WORDS: 100% VERIFIED!")
print(f"ALL 5 DAYS BETWEEN 35 AND 40 TOTAL MINUTES: 100% VERIFIED!")
print(f"=======================================================")
