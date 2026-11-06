# scripts/audit_all_branches.py
import os, glob, re

workspaces = {
    "Branch A (Present-Career-os)": r"C:\Users\Admin\Desktop\projects\Present-Career-os",
    "Branch B (Present-Career-os-commerce)": r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce",
    "Branch C (Present-Career-os-platform)": r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"
}

for w_name, w_path in workspaces.items():
    print(f"\n=======================================================")
    print(f"WORKSPACE: {w_name}")
    print(f"PATH: {w_path}")
    print(f"=======================================================")
    
    data_dir = os.path.join(w_path, "src", "lib", "data")
    if not os.path.exists(data_dir):
        print(f"Directory not found: {data_dir}")
        continue
        
    files = glob.glob(os.path.join(data_dir, "*LongLessons.ts"))
    print(f"Total LongLessons files: {len(files)}")
    
    active_courses = []
    for f in sorted(files):
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        days = re.findall(r'"day":\s*(\d+)', content)
        if len(days) > 0:
            int_days = sorted([int(d) for d in set(days)])
            active_courses.append((os.path.basename(f), len(days), min(int_days), max(int_days)))
            
    print(f"Courses with implemented days ({len(active_courses)}):")
    for fname, count, min_d, max_d in active_courses:
        print(f"  {fname:<35} | Count: {count:<3} | Range: Day {min_d} to Day {max_d}")
