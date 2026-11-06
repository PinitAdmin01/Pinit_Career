import os
import re

branches = {
    'Branch_A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch_B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch_C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

# Collect all files ending in LongLessons.ts from src/lib/data
all_files = sorted([f for f in os.listdir(os.path.join(branches['Branch_A'], 'src/lib/data')) if f.endswith('LongLessons.ts')])

data = []
for fname in all_files:
    row = {'file': fname}
    for bname, bpath in branches.items():
        fullpath = os.path.join(bpath, 'src/lib/data', fname)
        if os.path.exists(fullpath):
            with open(fullpath, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = sorted(list(set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c)])))
            m1 = [d for d in days if 1 <= d <= 30]
            m2 = [d for d in days if 31 <= d <= 60]
            row[bname.lower()] = {'m1': len(m1), 'm2': len(m2), 'total': len(days)}
        else:
            row[bname.lower()] = {'m1': 0, 'm2': 0, 'total': 0}
            
    best_m1 = max(row['branch_a']['m1'], row['branch_b']['m1'], row['branch_c']['m1'])
    best_m2 = max(row['branch_a']['m2'], row['branch_b']['m2'], row['branch_c']['m2'])
    row['best_m1'] = best_m1
    row['best_m2'] = best_m2
    row['m1_rem'] = max(0, 30 - best_m1)
    row['m2_rem'] = max(0, 30 - best_m2)
    row['total_rem'] = row['m1_rem'] + row['m2_rem']
    data.append(row)

# Let's filter out non-curriculum files (like longLessons.ts or helpers)
curriculum_files = [r for r in data if r['file'] != 'longLessons.ts']

print(f"Total Curriculum Files in src/lib/data: {len(curriculum_files)}")
print("\n" + "=" * 90)
print(f"{'#':<2} | {'File':<32} | {'M1 Done':<8} | {'M2 Done':<8} | {'M1 Rem':<7} | {'M2 Rem':<7} | {'Total Rem'}")
print("=" * 90)

total_m1_rem = 0
total_m2_rem = 0
for i, r in enumerate(curriculum_files):
    total_m1_rem += r['m1_rem']
    total_m2_rem += r['m2_rem']
    status = "DONE" if r['total_rem'] == 0 else f"{r['total_rem']}d left"
    print(f"{i+1:>2} | {r['file']:<32} | {r['best_m1']:>2}/30    | {r['best_m2']:>2}/30    | {r['m1_rem']:>2}d     | {r['m2_rem']:>2}d     | {status}")

print("=" * 90)
print(f"TOTAL M1 REMAINING: {total_m1_rem} days")
print(f"TOTAL M2 REMAINING: {total_m2_rem} days")
print(f"GRAND TOTAL DAYS REMAINING: {total_m1_rem + total_m2_rem} days")
