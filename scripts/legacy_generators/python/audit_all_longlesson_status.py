import os
import re
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

lesson_files = glob.glob('src/lib/data/*LongLessons*.ts')
print(f"Found {len(lesson_files)} long lesson files:")

results = []

for lf in sorted(lesson_files):
    basename = os.path.basename(lf)
    try:
        with open(lf, 'r', encoding='utf-8') as f:
            text = f.read()
        days = [int(x) for x in re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text)]
        unique_days = sorted(list(set(days)))
        count = len(unique_days)
        max_d = max(unique_days) if unique_days else 0
        min_d = min(unique_days) if unique_days else 0
        
        # Check course prefix
        m_prefix = re.search(r'coursePrefix[\'"]?\s*:\s*[\'"]([^\'"]+)[\'"]', text)
        prefix = m_prefix.group(1) if m_prefix else 'unknown'
        
        results.append({
            'file': basename,
            'prefix': prefix,
            'count': count,
            'min': min_d,
            'max': max_d,
            'days': unique_days
        })
    except Exception as e:
        results.append({
            'file': basename,
            'error': str(e)
        })

print(f"{'File':<35} | {'Prefix':<15} | {'Count':<5} | {'Range':<10} | {'Status'}")
print("-" * 85)
for r in results:
    if 'error' in r:
        print(f"{r['file']:<35} | ERROR: {r['error']}")
    else:
        rng = f"{r['min']}-{r['max']}" if r['count'] > 0 else "0"
        status = "60/60 COMPLETE" if r['count'] >= 60 else f"PARTIAL ({r['count']}/60)"
        print(f"{r['file']:<35} | {r['prefix']:<15} | {r['count']:<5} | {rng:<10} | {status}")
