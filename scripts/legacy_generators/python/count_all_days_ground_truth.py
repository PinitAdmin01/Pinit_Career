import glob
import re
import os

files = glob.glob('src/lib/data/*LongLessons.ts')
print(f"Total files: {len(files)}")

ground_truth = {}
for f in sorted(files):
    fname = os.path.basename(f)
    if fname == 'longLessons.ts':
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        text = fp.read()
    days = re.findall(r'[\'"]day[\'"]\s*:\s*(\d+)|(?<![\'"])day\s*:\s*(\d+)', text)
    extracted = []
    for d1, d2 in days:
        extracted.append(int(d1 or d2))
    unique_days = sorted(list(set(extracted)))
    ground_truth[fname] = {
        'total_entries': len(extracted),
        'unique_days_count': len(unique_days),
        'min_day': unique_days[0] if unique_days else 0,
        'max_day': unique_days[-1] if unique_days else 0,
        'missing_between_1_and_max': [d for d in range(1, (unique_days[-1] if unique_days else 0) + 1) if d not in unique_days]
    }

print(f"\n{'FILE NAME':35} | {'DAYS':6} | {'SPAN':10} | {'MISSING IN SPAN'}")
print("-" * 75)
for fname, info in ground_truth.items():
    span = f"{info['min_day']}-{info['max_day']}" if info['unique_days_count'] else "EMPTY"
    missing = str(info['missing_between_1_and_max'][:5]) if info['missing_between_1_and_max'] else "None"
    print(f"{fname:35} | {info['unique_days_count']:6} | {span:10} | {missing}")
