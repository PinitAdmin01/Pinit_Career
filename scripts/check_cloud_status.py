import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/cloudWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(x) for x in re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text)]
print(f"Days found: {len(days)}, min: {min(days) if days else 0}, max: {max(days) if days else 0}")
print("Day list:", days)
