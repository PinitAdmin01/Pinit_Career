import re

with open('src/lib/data/softSkillsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m1 = re.findall(r'day:\s*(\d+)', text)
m2 = re.findall(r'"day":\s*(\d+)', text)
days = sorted(list(set(int(x) for x in m1 + m2)))
print("Total unique days in softSkillsLongLessons.ts:", len(days))
print("Days:", days)
