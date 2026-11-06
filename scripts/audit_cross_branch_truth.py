import os
import re

branches = {
    'Branch_A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch_B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch_C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

# Read longLessons.ts from Branch A
with open(os.path.join(branches['Branch_A'], 'src/lib/data/longLessons.ts'), 'r', encoding='utf-8') as f:
    text = f.read()

imports = re.findall(r"import\s*\{\s*(\w+)\s*\}\s*from\s*'(\./[^']+)';", text)

# Map file base name to relative path
files = sorted(list(set([os.path.basename(p) + '.ts' for v, p in imports])))

print(f"Total Unique Course Files in longLessons.ts: {len(files)}")

# Check days in each branch for each file
data = []
for f in files:
    row = {'file': f}
    for bname, bpath in branches.items():
        fullpath = os.path.join(bpath, 'src/lib/data', f)
        if os.path.exists(fullpath):
            with open(fullpath, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = sorted(list(set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)])))
            m1 = [d for d in days if 1 <= d <= 30]
            m2 = [d for d in days if 31 <= d <= 60]
            row[bname + '_m1'] = len(m1)
            row[bname + '_m2'] = len(m2)
            row[bname + '_total'] = len(days)
            row[bname + '_max'] = max(days) if days else 0
        else:
            row[bname + '_m1'] = 0
            row[bname + '_m2'] = 0
            row[bname + '_total'] = 0
            row[bname + '_max'] = 0
    
    # Best across all 3 branches
    row['best_m1'] = max(row['Branch_A_m1'], row['Branch_B_m1'], row['Branch_C_m1'])
    row['best_m2'] = max(row['Branch_A_m2'], row['Branch_B_m2'], row['Branch_C_m2'])
    row['best_total'] = max(row['Branch_A_total'], row['Branch_B_total'], row['Branch_C_total'])
    data.append(row)

# Print comprehensive table
print(f"\n{'File':<35} | {'Branch A':<10} | {'Branch B':<10} | {'Branch C':<10} | {'BEST M1':<8} | {'BEST M2':<8} | {'Status'}")
print("-" * 105)

m1_completed_courses = 0
m2_completed_courses = 0
partial_courses = 0
zero_m2_courses = 0

for r in data:
    status = ""
    if r['best_m1'] == 30 and r['best_m2'] == 30:
        status = "60/60 FULL"
        m1_completed_courses += 1
        m2_completed_courses += 1
    elif r['best_m1'] == 30 and r['best_m2'] > 0:
        status = f"M1: 30, M2: {r['best_m2']}/30"
        m1_completed_courses += 1
        partial_courses += 1
    elif r['best_m1'] == 30 and r['best_m2'] == 0:
        status = "M1: 30, M2: 0/30"
        m1_completed_courses += 1
        zero_m2_courses += 1
    else:
        status = f"M1: {r['best_m1']}/30 (INCOMPLETE)"
    
    a_str = f"{r['Branch_A_m1']}+{r['Branch_A_m2']}"
    b_str = f"{r['Branch_B_m1']}+{r['Branch_B_m2']}"
    c_str = f"{r['Branch_C_m1']}+{r['Branch_C_m2']}"
    print(f"{r['file']:<35} | {a_str:<10} | {b_str:<10} | {c_str:<10} | {r['best_m1']:<8} | {r['best_m2']:<8} | {status}")

print("\n" + "=" * 50)
print(f"Total Unique Files: {len(data)}")
print(f"Courses with Month 1 100% Complete (30 days): {m1_completed_courses}/{len(data)}")
print(f"Courses with Month 2 100% Complete (60 days): {m2_completed_courses}/{len(data)}")
print(f"Courses with Month 2 In Progress: {partial_courses}/{len(data)}")
print(f"Courses with Month 2 Not Started (0/30): {zero_m2_courses}/{len(data)}")
