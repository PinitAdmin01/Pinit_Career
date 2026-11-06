import os, glob, re

base_paths = {
    'Branch C (Platform)': r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\src\lib\data',
    'Branch A (Tech)': r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data',
    'Branch B (Commerce)': r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data'
}

for name, path in base_paths.items():
    if not os.path.exists(path):
        print(f'{name}: path not found')
        continue
    files = glob.glob(os.path.join(path, '*LongLessons.ts'))
    print(f'=== {name} ===')
    total_days = 0
    course_count = 0
    for f in sorted(files):
        fname = os.path.basename(f)
        try:
            with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            days = re.findall(r'"day":\s*(\d+)', c)
            max_day = max([int(d) for d in days]) if days else 0
            cnt = len(days)
            total_days += cnt
            course_count += 1
            print(f'  {fname:<32}: {cnt:>2}/60 days (max day {max_day:>2})')
        except Exception as e:
            print(f'  {fname:<32}: error {e}')
    print(f'Total in {name}: {total_days} days across {course_count} curriculum files\n')
