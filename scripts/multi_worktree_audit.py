"""
Multi-Worktree Audit: Check the state of every course across all 3 worktrees:
1. Main: C:/Users/Admin/Desktop/projects/Present-Career-os
2. Commerce: C:/Users/Admin/Desktop/projects/Present-Career-os-commerce
3. Platform: C:/Users/Admin/Desktop/projects/Present-Career-os-platform
"""
import os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

worktrees = {
    "Main (Tech/IoT/NLP)": "C:/Users/Admin/Desktop/projects/Present-Career-os",
    "Branch B (Commerce 1-7)": "C:/Users/Admin/Desktop/projects/Present-Career-os-commerce",
    "Branch C (Commerce 8-14 / Web)": "C:/Users/Admin/Desktop/projects/Present-Career-os-platform"
}

from scripts.audit_exact_36_courses import course_mappings

print("=" * 105)
print(f"{'#':<3} | {'Course Identifier':<38} | {'Main':<7} | {'Branch B':<8} | {'Branch C':<8} | {'Max Found':<9} | {'Final Status'}")
print("-" * 105)

total_max_days = 0
courses_60 = 0

for idx, (title, rel_path, arr_name, prefix) in enumerate(course_mappings[:36], 1):
    counts = {}
    for wt_name, wt_path in worktrees.items():
        fpath = os.path.join(wt_path, rel_path)
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8') as f:
                src = f.read()
            days = [int(x) for x in re.findall(r'"day":\s*(\d+)', src)]
            counts[wt_name] = len(set(days))
        else:
            counts[wt_name] = 0
            
    c_main = counts["Main (Tech/IoT/NLP)"]
    c_b = counts["Branch B (Commerce 1-7)"]
    c_c = counts["Branch C (Commerce 8-14 / Web)"]
    max_d = max(c_main, c_b, c_c)
    total_max_days += max_d
    if max_d == 60:
        courses_60 += 1
    status = "60/60 (100%)" if max_d == 60 else f"{max_d}/60 (DEFICIT)"
    
    print(f"{idx:<3} | {title[:38]:<38} | {c_main:<7} | {c_b:<8} | {c_c:<8} | {max_d:<9} | {status}")

print("-" * 105)
print(f"TRI-BRANCH SYNTHESIS (CANONICAL 36 COURSES):")
print(f"  Courses 100% Completed Across Worktrees: {courses_60} / 36")
print(f"  Total Days Conquered Across Branches:    {total_max_days} / 2,160 Days ({(total_max_days/2160)*100:.2f}%)")
print("=" * 105)

print("\nBONUS / SPECIALIZED COURSES:")
print("-" * 105)
for idx, (title, rel_path, arr_name, prefix) in enumerate(course_mappings[36:], 37):
    counts = {}
    for wt_name, wt_path in worktrees.items():
        fpath = os.path.join(wt_path, rel_path)
        if os.path.exists(fpath):
            with open(fpath, 'r', encoding='utf-8') as f:
                src = f.read()
            days = [int(x) for x in re.findall(r'"day":\s*(\d+)', src)]
            counts[wt_name] = len(set(days))
        else:
            counts[wt_name] = 0
            
    c_main = counts["Main (Tech/IoT/NLP)"]
    c_b = counts["Branch B (Commerce 1-7)"]
    c_c = counts["Branch C (Commerce 8-14 / Web)"]
    max_d = max(c_main, c_b, c_c)
    status = "60/60 (100%)" if max_d == 60 else f"{max_d}/60 (DEFICIT)"
    print(f"{idx:<3} | {title[:38]:<38} | {c_main:<7} | {c_b:<8} | {c_c:<8} | {max_d:<9} | {status}")
print("=" * 105)
