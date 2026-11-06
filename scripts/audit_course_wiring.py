with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    c_text = f.read()

with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    ll_text = f.read()

import re

# Find all course IDs
c_ids = re.findall(r'id:\s*["\']([^"\']+)["\']', c_text)

# Find all prefixes in LONG_LESSON_SOURCES
prefixes = re.findall(r'["\']?([a-zA-Z0-9_-]+)["\']?\s*:\s*[A-Z_]+LONG_LESSONS', ll_text)

print(f"Total courses in coursesData: {len(c_ids)}")
print(f"Total sources in longLessons: {len(prefixes)}")

# Check curriculumEnricher course to prefix mapping
with open('src/lib/data/curriculumEnricher.ts', 'r', encoding='utf-8') as f:
    ce_text = f.read()

prefix_map = re.findall(r'["\']?([a-zA-Z0-9_-]+)["\']?\s*:\s*["\']([a-zA-Z0-9_-]+)["\']', ce_text)
print(f"Prefix mappings in curriculumEnricher: {len(prefix_map)}")
