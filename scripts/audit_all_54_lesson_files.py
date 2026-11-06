# scripts/audit_all_54_lesson_files.py
import os
import re

data_dir = 'src/lib/data'
files = [f for f in os.listdir(data_dir) if (f.endswith('LongLessons.ts') or f.endswith('Lessons.ts')) and f != 'longLessons.ts']

results = []
total_all_days = 0

for f in sorted(files):
    fpath = os.path.join(data_dir, f)
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
    day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 120)))
    count = len(day_nums)
    total_all_days += count
    
    # Try to find course prefix or export const name
    m_exp = re.search(r'export const\s+([A-Za-z0-9_]+)', content)
    exp_name = m_exp.group(1) if m_exp else ''
    
    m_prefix = re.search(r'["\']?coursePrefix["\']?\s*:\s*["\']([^"\']+)["\']', content)
    prefix = m_prefix.group(1) if m_prefix else ''
    
    results.append({
        'file': f,
        'export': exp_name,
        'prefix': prefix,
        'count': count,
        'min_day': min(day_nums) if day_nums else 0,
        'max_day': max(day_nums) if day_nums else 0
    })

print(f"{'#':<3} | {'Lesson File':<32} | {'Prefix':<16} | {'Days':<6} | {'Range':<10} | {'Status'}")
print("=" * 90)

for idx, r in enumerate(results, 1):
    status = "COMPLETE (60d)" if r['count'] == 60 else ("30d Track" if r['count'] == 30 else f"PARTIAL ({r['count']}d)")
    print(f"{idx:>2}  | {r['file']:<32} | {r['prefix']:<16} | {r['count']:>4}   | {r['min_day']}-{r['max_day']:<8} | {status}")

print("=" * 90)
print(f"TOTAL LESSON FILES AUDITED: {len(results)}")
print(f"TOTAL LESSON DAYS IMPLEMENTED ACROSS ALL 53 FILES: {total_all_days} Days!")
