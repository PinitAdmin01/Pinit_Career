import os
import re

bcom_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data"
for f in sorted(os.listdir(bcom_dir)):
    if f.startswith("bcom") and f.endswith("LongLessons.ts"):
        path = os.path.join(bcom_dir, f)
        with open(path, "r", encoding="utf-8", errors="ignore") as fp:
            content = fp.read()
        days1 = [int(x) for x in re.findall(r'day:\s*(\d+)', content)]
        days2 = [int(x) for x in re.findall(r'"day":\s*(\d+)', content)]
        all_days = sorted(set(days1 + days2))
        print(f"{f:32s}: {len(all_days):2d} days -> {min(all_days) if all_days else 0}..{max(all_days) if all_days else 0}")
