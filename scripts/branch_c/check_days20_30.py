import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('src/lib/data/aiWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"day":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
for d, title in matches:
    if int(d) >= 15:
        print(f"Day {d}: {title}")
