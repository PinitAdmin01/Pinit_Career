import re

with open('src/lib/data/aiWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
days = sorted(list(set(int(d) for d in days)))
print(f"Total distinct days found in aiWebLongLessons.ts: {len(days)}")
print(f"Days: {days}")
assert len(days) == 60, f"Expected 60 days, got {len(days)}"
assert days == list(range(1, 61)), "Days list is not 1..60!"
print("PERFECT! ALL 60 DAYS (1 TO 60) ARE PRESENT IN aiWebLongLessons.ts!")
