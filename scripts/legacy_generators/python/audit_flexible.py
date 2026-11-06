"""
Audit LongLessons using flexible regex that matches both '"day": N' and 'day: N'.
"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from scripts.audit_exact_36_courses import course_mappings

worktree = "C:/Users/Admin/Desktop/projects/Present-Career-os"

print("=" * 85)
print(f"{'#':<3} | {'Course':<45} | {'Days':<6} | {'Status'}")
print("-" * 85)

total_days = 0
courses_60 = 0

for idx, (title, rel_path, arr_name, prefix) in enumerate(course_mappings, 1):
    fpath = os.path.join(worktree, rel_path)
    if not os.path.exists(fpath):
        print(f"{idx:<3} | {title[:45]:<45} | 0      | FILE NOT FOUND")
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        src = f.read()
    
    # Match both "day": 12 and day: 12
    matches = re.findall(r'(?:["\']?day["\']?)\s*:\s*(\d+)', src)
    unique_days = sorted(list(set(int(x) for x in matches if 1 <= int(x) <= 60)))
    count = len(unique_days)
    total_days += count
    if count == 60:
        courses_60 += 1
    status = "60/60 (100.0%)" if count == 60 else f"{count}/60 (DEFICIT: {60-count} days)"
    print(f"{idx:<3} | {title[:45]:<45} | {count:<6} | {status}")

print("=" * 85)
print(f"Total Courses Evaluated:        {len(course_mappings)}")
print(f"Courses at 60/60 Days:          {courses_60} / {len(course_mappings)}")
print(f"Total Days Present in Worktree: {total_days}")
print("=" * 85)
