import re

with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

courses = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', text)
print(f"Total courses in coursesData.ts: {len(courses)}")
for i, c in enumerate(courses, 1):
    print(f"{i:2d}. {c}")
