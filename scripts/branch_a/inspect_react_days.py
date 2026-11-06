import re

with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
day_ints = [int(d) for d in days]
print(f"Total 'day' occurrences: {len(day_ints)}")
from collections import Counter
counts = Counter(day_ints)
for day in sorted(counts.keys()):
    print(f"Day {day}: {counts[day]} occurrence(s)")
