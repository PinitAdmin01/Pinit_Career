import re
from collections import Counter

with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
counts = Counter(days)
dups = {k: v for k, v in counts.items() if v > 1}
print("Duplicate days in iotSecLongLessons.ts:", dups)
print(f"Total days found: {len(days)}, Unique days: {len(counts)}")
print(f"Unique days list: {sorted(counts.keys())}")
