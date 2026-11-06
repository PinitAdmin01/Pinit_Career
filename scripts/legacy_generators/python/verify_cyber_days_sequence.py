import re

with open('src/lib/data/cyberWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', content)]
print(f'Found days count: {len(days)}')
print(f'Days range: {min(days)} to {max(days)}')
assert days == list(range(1, 61)), f'Sequence mismatch! Expected 1..60, got {days}'
print('All days 1..60 are sequentially present and contiguous! 100% COMPLETE!')
