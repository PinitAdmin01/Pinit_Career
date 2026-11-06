import json
import re

with open('src/lib/data/nlpPythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'"day":\s*(\d+)', text)]
print(f"Total days in nlpPythonLongLessons.ts: {len(days)}")
print(f"Days: {days}")
