import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day36_data import day36
from blockchain_day37_data import day37
from blockchain_day38_data import day38
from blockchain_day39_data import day39
from blockchain_day40_data import day40

days = [day36, day37, day38, day39, day40]

def verify_day(d):
    day_num = d["day"]
    title = d["title"].encode('ascii', 'ignore').decode('ascii')
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts"
    assert len(d.get("summary", [])) >= 5, f"Day {day_num} summary must have >= 5 items"
    assert len(d.get("projectStep", {}).get("steps", [])) >= 5, f"Day {day_num} projectStep must have >= 5 items"

    total_words = 0
    print(f"\n--- Day {day_num}: {title} ---")
    for idx, p in enumerate(parts):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
        words = len(say_text.split())
        total_words += words
        safe_part_title = p['title'][:35].encode('ascii', 'ignore').decode('ascii')
        print(f"  Part {idx+1}: {words} words ({safe_part_title}...)")
        assert words >= 580, f"Part {idx+1} has {words} words, must be >= 580"

    spoken = round(total_words / 120)
    total_min = spoken + 10
    print(f"Total Day {day_num}: {total_words} words ({spoken} spoken min, {total_min} total min)")
    assert spoken >= 20, f"Spoken minutes must be >= 20, got {spoken}"
    assert 35 <= total_min <= 40, f"Total minutes must be 35-40, got {total_min}"
    return total_words

total_batch_words = 0
for d in days:
    total_batch_words += verify_day(d)

print(f"\n=======================================================")
print(f"TOTAL BATCH 2 WORDS ACROSS DAYS 36-40: {total_batch_words} words")
print(f"AVERAGE WORDS PER DAY: {total_batch_words / 5:.1f} words/day")
print(f"AVERAGE SPOKEN MINUTES: {(total_batch_words / 5) / 120:.1f} min/day")
print(f"ALL 25 PARTS STRICTLY >= 580 WORDS: 100% VERIFIED!")
print(f"ALL 5 DAYS BETWEEN 35 AND 40 TOTAL MINUTES: 100% VERIFIED!")
print(f"=======================================================")
