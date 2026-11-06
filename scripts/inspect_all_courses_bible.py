import json

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

print(f"Total courses in summary: {len(courses)}")
for c in courses:
    num = c.get('num', '?')
    cid = c.get('id', '')
    title = c.get('title', '')
    print(f"Course {num:>2}: {cid:<30} | {title}")
