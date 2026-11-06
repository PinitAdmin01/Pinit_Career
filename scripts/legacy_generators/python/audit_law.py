import os
import re

for branch_name, branch_path in [
    ("Branch B (Present-Career-os-commerce)", r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"),
    ("Branch C (Present-Career-os-platform)", r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform"),
    ("Branch A (Present-Career-os)", r"C:\Users\Admin\Desktop\projects\Present-Career-os")
]:
    print(f"\n=== {branch_name} ===")
    for fname in sorted(os.listdir(os.path.join(branch_path, "src", "lib", "data"))):
        if fname.startswith("bcom") and fname.endswith("LongLessons.ts"):
            fpath = os.path.join(branch_path, "src", "lib", "data", fname)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                t = f.read()
            days = sorted(set(int(x) for x in re.findall(r'day:\s*(\d+)', t)))
            print(f"{fname:30s}: {len(days):2d} days -> {min(days) if days else 0}..{max(days) if days else 0}")
