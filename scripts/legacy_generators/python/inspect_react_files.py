# scripts/inspect_react_files.py
import re

with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    t1 = f.read()
d1 = re.findall(r'"day":\s*(\d+)', t1)
print(f"Days in react30DayData.ts: {len(d1)} -> {d1[:5]}...{d1[-5:]}")

with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    t2 = f.read()
d2 = re.findall(r'"day":\s*(\d+)', t2)
print(f"Days in reactLongLessons.ts: {len(d2)} -> {d2}")
