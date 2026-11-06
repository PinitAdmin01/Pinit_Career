import re
import sys

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text)
print(f"Total days found: {len(days)}")
print(f"Days: {days}")
