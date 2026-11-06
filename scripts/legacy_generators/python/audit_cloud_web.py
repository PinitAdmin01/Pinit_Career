# scripts/audit_cloud_web.py
import json

with open("src/lib/data/cloudWebLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

print(f"cloudWebLongLessons.ts lines: {len(text.splitlines())}")

# Let's check how many parts per day and word counts
import re
day_blocks = re.split(r'[\"\']?day[\"\']?:\s*', text)[1:]
print(f"Found {len(day_blocks)} day blocks.")

for i, block in enumerate(day_blocks[:5]):
    day_num = block.split(",")[0].strip()
    say_matches = re.findall(r'say:\s*\[(.*?)\]', block, re.DOTALL)
    print(f"Day {day_num}: {len(say_matches)} parts with say array.")
    total_words = 0
    for sm in say_matches:
        words = len(re.findall(r'\b\w+\b', sm))
        total_words += words
    print(f"Day {day_num} total words: {total_words}")
