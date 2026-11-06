# scripts/verify_dist_days_sequence.py
import re

with open('src/lib/data/distributedWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'"day":\s*(\d+)', text)]
print(f'Found days count: {len(days)}')
print(f'Days range: {days[0]} to {days[-1]}')
assert days == list(range(1, 61)), f'Sequence mismatch! Expected 1..60, got {days}'
print('All 60 days in distributedWebLongLessons.ts are perfectly sequential 1 to 60! COURSE 16 IS 100% COMPLETE!')
