import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

branches = {
    'Branch A': r'C:\Users\Admin\Desktop\projects\Present-Career-os',
    'Branch B': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce',
    'Branch C': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform',
}

bcom_files = [
    'bcomAccountingLongLessons.ts',
    'bcomFinanceLongLessons.ts',
    'bcomTaxLongLessons.ts',
    'bcomAudLongLessons.ts',
    'bcomBanLongLessons.ts',
    'bcomLawLongLessons.ts',
    'bcomOpsLongLessons.ts',
    'bcomAitLongLessons.ts',
    'bcomAnaLongLessons.ts',
    'bcomMktLongLessons.ts',
    'bcomScrmLongLessons.ts',
    'bcomEntLongLessons.ts',
    'bcomEcomLongLessons.ts',
    'bcomDmktLongLessons.ts',
]

print(f"{'Commerce File':<30} | {'Branch A':<10} | {'Branch B':<10} | {'Branch C':<10}")
print("-" * 68)

for bf in bcom_files:
    counts = []
    for bname, bpath in branches.items():
        fp = os.path.join(bpath, 'src', 'lib', 'data', bf)
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                c = f.read()
            days = set([int(d) for d in re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', c) if 1 <= int(d) <= 60])
            counts.append(f"{len(days)} days")
        else:
            counts.append("Missing")
    print(f"{bf:<30} | {counts[0]:<10} | {counts[1]:<10} | {counts[2]:<10}")
