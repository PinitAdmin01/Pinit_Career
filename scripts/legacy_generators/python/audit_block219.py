import os
import sys
sys.path.insert(0, os.getcwd())

from scripts.bcom_ops_day16_builder import get_day16_data
from scripts.bcom_ops_day17_builder import get_day17_data
from scripts.bcom_ops_day18_builder import get_day18_data
from scripts.bcom_ops_day19_builder import get_day19_data
from scripts.bcom_ops_day20_builder import get_day20_data

days = [get_day16_data(), get_day17_data(), get_day18_data(), get_day19_data(), get_day20_data()]
grand_words = 0
all_passed = True

for d in days:
    day_words = sum(sum(len(p.split()) for p in part['say']) for part in d['parts'])
    grand_words += day_words
    print(f"Day {d['day']} ({d['title'][:40]}...): {day_words} words ({day_words/150:.1f} mins)")
    for i, p in enumerate(d['parts'], 1):
        pw = sum(len(x.split()) for x in p['say'])
        status = 'OK' if pw >= 580 else 'FAIL'
        if pw < 580:
            all_passed = False
        print(f"   Part {i}: {pw} words [{status}]")
    if day_words < 2950:
        all_passed = False
        print(f"   DAY TOTAL FAIL: {day_words} words is below 2950 threshold")

print(f"\nGrand Total Spoken Words: {grand_words} across 5 days (Average {grand_words/5:.1f} words/day)")
print(f"All LongLesson invariants met: {all_passed}")
