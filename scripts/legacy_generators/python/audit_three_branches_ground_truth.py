import os
import glob
import re

branches = {
    'Branch A (main)': 'C:/Users/Admin/Desktop/projects/Present-Career-os',
    'Branch B (Commerce)': 'C:/Users/Admin/Desktop/projects/Present-Career-os-commerce',
    'Branch C (Platform)': 'C:/Users/Admin/Desktop/projects/Present-Career-os-platform'
}

for b_name, b_path in branches.items():
    print('='*75)
    print(f'AUDIT FOR: {b_name} ({b_path})')
    print('='*75)
    data_dir = os.path.join(b_path, 'src', 'lib', 'data')
    if not os.path.exists(data_dir):
        print('No src/lib/data found!')
        continue
    files = glob.glob(os.path.join(data_dir, '*LongLessons.ts'))
    for f in sorted(files):
        fname = os.path.basename(f)
        if fname == 'longLessons.ts':
            continue
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
        day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 60)))
        total_days = len(day_nums)
        if total_days > 0:
            min_day = day_nums[0]
            max_day = day_nums[-1]
            print(f'{fname:<32} | Days: {total_days:>2}/60 | Range: Day {min_day:>2} - {max_day:>2}')
