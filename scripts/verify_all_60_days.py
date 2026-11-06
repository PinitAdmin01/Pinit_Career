with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
days = [int(d) for d in re.findall(r'"day":\s*(\d+)', text)]
print(f"Total days found: {len(days)}")
print(f"Days: {days}")
assert len(days) == 60, f"Expected 60 days, got {len(days)}"
assert days == list(range(1, 61)), "Expected days 1..60 strictly in order"
print("\nCOURSE 06 designWebLongLessons.ts VERIFIED: EXACTLY 60/60 DAYS IN SEQUENCE!")
