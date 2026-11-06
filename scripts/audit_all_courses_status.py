# scripts/audit_all_courses_status.py
import glob
import re
import os

files = glob.glob('src/lib/data/*LongLessons*.ts')
results = []

for f in sorted(files):
    fname = os.path.basename(f)
    if fname == 'longLessons.ts':
        continue
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        text = fp.read()
    
    d1 = [int(x) for x in re.findall(r'(?<!")day:\s*(\d+)', text)]
    d2 = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
    days = sorted(list(set(d1 + d2)))
    
    if days:
        min_d = min(days)
        max_d = max(days)
        cnt = len(days)
        missing_m1 = [d for d in range(1, 31) if d not in days]
        missing_m2 = [d for d in range(31, 61) if d not in days]
        missing_all = [d for d in range(1, 61) if d not in days]
        results.append({
            'file': fname,
            'count': cnt,
            'min': min_d,
            'max': max_d,
            'missing_m1': missing_m1,
            'missing_m2': missing_m2,
            'missing_all': missing_all
        })

print(f"{'FILE':<35} | {'COUNT':<5} | {'RANGE':<8} | {'STATUS':<25}")
print("-" * 80)
for r in results:
    if len(r['missing_all']) == 0:
        status = "60/60 FULL GRADUATED"
    elif len(r['missing_m2']) == 0:
        status = f"Month 2 Complete (missing M1: {len(r['missing_m1'])}d)"
    elif len(r['missing_m1']) == 0:
        status = f"Month 1 Complete (missing M2: {len(r['missing_m2'])}d)"
    else:
        status = f"Partial: missing M1={len(r['missing_m1'])}d, M2={len(r['missing_m2'])}d"
    print(f"{r['file']:<35} | {r['count']:<5} | {r['min']}..{r['max']:<5} | {status}")
