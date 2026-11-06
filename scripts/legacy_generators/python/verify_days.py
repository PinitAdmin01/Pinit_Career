# scripts/verify_days.py
import re
from pathlib import Path

content = Path('src/lib/data/bcomAnaLongLessons.ts').read_text(encoding='utf-8')
matches = re.findall(r'"day":\s*(\d+)', content)
day_ints = sorted(list(set(int(x) for x in matches)))
print(f"Total days found: {len(day_ints)}")
print(f"Min day: {min(day_ints)}, Max day: {max(day_ints)}")
missing = [d for d in range(1, 61) if d not in day_ints]
print(f"Missing days: {missing}")
