# scripts/deep_audit_courses.py
import os, glob, re

workspaces = {
    "Branch A": r"C:\Users\Admin\Desktop\projects\Present-Career-os",
    "Branch B": r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce",
    "Branch C": r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"
}

course_status = {}

for w_name, w_path in workspaces.items():
    data_dir = os.path.join(w_path, "src", "lib", "data")
    if not os.path.exists(data_dir):
        continue
    files = glob.glob(os.path.join(data_dir, "*LongLessons.ts"))
    for f in files:
        base = os.path.basename(f)
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        days = re.findall(r'"day":\s*(\d+)', content)
        if base not in course_status:
            course_status[base] = {}
        if days:
            int_days = sorted(list(set(int(d) for d in days)))
            course_status[base][w_name] = {
                "count": len(int_days),
                "min": min(int_days),
                "max": max(int_days),
                "days": int_days
            }
        else:
            course_status[base][w_name] = {
                "count": 0,
                "min": 0,
                "max": 0,
                "days": []
            }

print("=== DEEP COURSE COMPARISON ACROSS BRANCHES ===")
collisions = []
gaps = []

for base, branch_data in sorted(course_status.items()):
    active_in = [b for b, d in branch_data.items() if d["count"] > 0]
    if len(active_in) > 1:
        # Check if they have different day counts or overlapping days
        diffs = [f"{b}: {branch_data[b]['count']}d (D{branch_data[b]['min']}-D{branch_data[b]['max']})" for b in active_in]
        collisions.append((base, diffs))
    
    # Check for gaps in any branch that has >0 days
    for b in active_in:
        days = branch_data[b]["days"]
        if days and len(days) < (max(days) - min(days) + 1):
            missing = sorted(list(set(range(min(days), max(days) + 1)) - set(days)))
            gaps.append((base, b, missing))

print(f"\n--- POTENTIAL COLLISIONS / OVERLAPS ({len(collisions)}) ---")
for base, diffs in collisions:
    print(f"File: {base:<32} | {' vs '.join(diffs)}")

print(f"\n--- GAPS / MISSING DAYS WITHIN RANGES ({len(gaps)}) ---")
for base, b, missing in gaps:
    print(f"File: {base:<32} | {b} | Missing: {missing[:15]} (total missing: {len(missing)})")
