import json

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

for c in courses:
    print(f"{c['num']:<2} | {c['id']:<32} | {c['title']}")
