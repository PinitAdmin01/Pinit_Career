"""
Verify all 60 days of NLP in nlpPythonLongLessons.ts
"""
import re
with open('src/lib/data/nlpPythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
print(f"Total days found: {len(days)}")
print(f"Unique days: {len(set(days))}")
print(f"Min day: {min(days)}, Max day: {max(days)}")
assert len(days) == 60, f"Expected 60 days, got {len(days)}"
assert sorted(days) == list(range(1, 61)), "Missing or out of order days!"
print("COURSE 37 (nlp-py) ALL 60 DAYS ARE 100% PRESENT AND ORDERED!")
