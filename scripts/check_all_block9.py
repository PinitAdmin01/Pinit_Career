# scripts/check_all_block9.py
import sys, os
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("scripts"))
from check_day_stats import check_day

all_passed = True
total_all_days = 0
for day_num in range(41, 46):
    mod = __import__(f"data_devops_day{day_num}")
    day_obj = getattr(mod, f"DAY_{day_num}")
    passed = check_day(day_obj)
    total_words = sum(sum(len(s.split()) for s in p['say']) for p in day_obj['parts'])
    total_all_days += total_words
    if not passed:
        all_passed = False
    print("-" * 60)

print(f"Block 9 Grand Total Words: {total_all_days}")
print("ALL 5 DAYS PASSED:" if all_passed else "SOME DAYS FAILED")
if not all_passed:
    sys.exit(1)
