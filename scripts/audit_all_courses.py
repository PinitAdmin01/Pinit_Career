# scripts/audit_all_courses.py
from pathlib import Path
import re

data_dir = Path("src/lib/data")
courses = {}

for p in sorted(data_dir.glob("*LongLessons.ts")):
    text = p.read_text(encoding="utf-8", errors="ignore")
    # find coursePrefix
    cp_match = re.search(r'coursePrefix[\'":\s]+([a-zA-Z0-9_-]+)', text)
    cp = cp_match.group(1) if cp_match else p.stem
    
    days = sorted(list(set(int(x) for x in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', text))))
    m1 = [d for d in days if 1 <= d <= 30]
    m2 = [d for d in days if 31 <= d <= 60]
    
    courses[p.name] = {
        "prefix": cp,
        "total": len(days),
        "m1": len(m1),
        "m2": len(m2),
        "min": min(days) if days else None,
        "max": max(days) if days else None
    }

print(f"{'Filename':<32} | {'Prefix':<16} | {'Total':<6} | {'M1':<4} | {'M2':<4} | {'Range'}")
print("-" * 80)
for fn, d in courses.items():
    print(f"{fn:<32} | {d['prefix']:<16} | {d['total']:<6} | {d['m1']:<4} | {d['m2']:<4} | Day {d['min']} to {d['max']}")

print("\nCourses needing Month 2 (M2 < 30):")
for fn, d in courses.items():
    if d['m2'] < 30:
        print(f"  --> {fn} (Prefix: {d['prefix']}) has only {d['m2']}/30 days in Month 2!")
