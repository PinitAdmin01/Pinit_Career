# scripts/inspect_scrm_block8.py
import re

with open('src/lib/data/bcomScrmLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(f'day: {d},' in line for d in range(36, 41)):
        # print the next few lines
        print("".join(lines[i:i+6]))
