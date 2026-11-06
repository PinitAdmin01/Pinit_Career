import re

with open('src/lib/data/coursesCatalog.ts', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", text)
print(f"Total courses in COURSES_CATALOG: {len(ids)}")
for i, cid in enumerate(ids):
    print(f"  {i+1:>2}. {cid}")

with open('src/lib/visuals/enabledCourses.ts', 'r', encoding='utf-8', errors='ignore') as f:
    v_text = f.read()
prefixes = re.findall(r"['\"]([a-zA-Z0-9_\-]+)['\"]", v_text)
print(f"\nPrefixes in enabledCourses.ts: {len(prefixes)}")
print(prefixes)
