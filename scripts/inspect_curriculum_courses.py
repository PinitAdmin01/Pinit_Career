import os
import re

with open('src/lib/data/curriculumData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find tracks / degrees
degrees = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]\s*,\s*name:\s*[\'"]([^\'"]+)[\'"]', text)
print("=== DEGREES / TRACKS ===")
for d_id, d_name in degrees:
    print(f"  {d_id:<25}: {d_name}")

# Find all course objects with id, title, prefix or similar
# Let's find every `id: '...', title: '...'`
courses = re.findall(r'\{\s*id:\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*,\s*(?:coursePrefix:\s*[\'"]([a-zA-Z0-9_\-]+)[\'"]\s*,\s*)?title:\s*[\'"]([^\'"]+)[\'"]', text)
print(f"\nTotal Courses found in curriculumData.ts: {len(courses)}")
for cid, cpref, ctitle in courses:
    print(f"  {cid:<25} (prefix: {str(cpref):<15}) -> {ctitle}")
