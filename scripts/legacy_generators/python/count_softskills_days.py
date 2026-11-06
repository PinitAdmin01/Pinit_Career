import json
import re

with open('src/lib/data/softSkillsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'[\'"]day[\'"]:\s*(\d+)', text)
unique_days = sorted(list(set(int(d) for d in days)))
print('Total day occurrences:', len(days))
print('Count of unique days:', len(unique_days))
print('Unique days list:', unique_days)
