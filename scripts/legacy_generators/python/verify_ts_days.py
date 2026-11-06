# scripts/verify_ts_days.py
import re

with open("src/lib/data/iotNetLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Match either "day": X or day: X
days = re.findall(r'["\']?day["\']?:\s*(\d+)', text)
day_nums = [int(d) for d in days]
print(f"Total days found: {len(day_nums)}")
print(f"Days: {day_nums}")
assert day_nums == list(range(1, 31)), "Mismatch in days list!"
print(">>> ALL 30 DAYS (DAYS 1-30) ARE 100% PRESENT, SEQUENTIAL, AND VALID! <<<")
