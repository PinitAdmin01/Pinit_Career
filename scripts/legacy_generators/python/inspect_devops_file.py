# scripts/inspect_devops_file.py
import re

with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print(f"Total days currently in devopsWebLongLessons.ts: {len(days)}")
print(f"Days found: {days}")
