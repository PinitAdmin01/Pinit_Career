import os
import re
import json

# Map of long lesson sources in longLessons.ts
with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all imported long lesson files
imports = re.findall(r"import\s*\{\s*(\w+)\s*\}\s*from\s*'(\./[^']+)';", text)

print(f"Total imports in longLessons.ts: {len(imports)}")

courses_stats = []

for var_name, rel_path in imports:
    filepath = os.path.normpath(os.path.join('src/lib/data', rel_path + '.ts'))
    if not os.path.exists(filepath):
        continue
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            c = f.read()
        
        # Find all day occurrences
        days = [int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)]
        unique_days = sorted(list(set(days)))
        
        m1_days = [d for d in unique_days if 1 <= d <= 30]
        m2_days = [d for d in unique_days if 31 <= d <= 60]
        
        courses_stats.append({
            'var': var_name,
            'file': os.path.basename(filepath),
            'm1_count': len(m1_days),
            'm2_count': len(m2_days),
            'total': len(unique_days),
            'm1_complete': len(m1_days) == 30,
            'm2_complete': len(m2_days) == 30,
            'full_60': len(m1_days) == 30 and len(m2_days) == 30
        })
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

# Summary
m1_full = [c for c in courses_stats if c['m1_complete']]
m1_incomplete = [c for c in courses_stats if not c['m1_complete']]

m2_full = [c for c in courses_stats if c['m2_complete']]
m2_missing = [c for c in courses_stats if c['m2_count'] == 0]
m2_partial = [c for c in courses_stats if 0 < c['m2_count'] < 30]

print(f"Total course files audited: {len(courses_stats)}")
print(f"M1 Complete (30 days): {len(m1_full)}")
print(f"M1 Incomplete (<30 days): {len(m1_incomplete)}")
for c in m1_incomplete:
    print(f"  - {c['file']}: M1={c['m1_count']}/30, M2={c['m2_count']}/30")

print(f"\nM2 Complete (30 days): {len(m2_full)}")
for c in m2_full:
    print(f"  + {c['file']}: 60/60 Days")

print(f"\nM2 Partial (1-29 days): {len(m2_partial)}")
for c in m2_partial:
    print(f"  ~ {c['file']}: M2={c['m2_count']}/30")

print(f"\nM2 Completely Missing (0 days): {len(m2_missing)}")
