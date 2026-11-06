import os
import re

dir_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data'
files = [f for f in os.listdir(dir_path) if f.startswith('bcom') and f.endswith('.ts')]

print("=== AUDIT OF BCOM COURSES IN BRANCH B WORKSPACE ===")
for f in sorted(files):
    full_path = os.path.join(dir_path, f)
    with open(full_path, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    days = re.findall(r'"day":\s*(\d+)', content)
    day_nums = sorted(set(int(d) for d in days))
    max_d = max(day_nums) if day_nums else 0
    count_d = len(day_nums)
    print(f"{f:32s} -> Total Days: {count_d:2d} | Max Day: {max_d:2d}")
