# scripts/compare_bcom_law.py
import re

b_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomLawLongLessons.ts"
c_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-platform\src\lib\data\bcomLawLongLessons.ts"

with open(b_path, 'r', encoding='utf-8') as f:
    b_txt = f.read()

with open(c_path, 'r', encoding='utf-8') as f:
    c_txt = f.read()

b_days = re.findall(r'"day":\s*(\d+)', b_txt)
c_days = re.findall(r'"day":\s*(\d+)', c_txt)

print(f"Branch B bcomLaw days ({len(b_days)}): {min(int(d) for d in b_days)} to {max(int(d) for d in b_days)}")
print(f"Branch C bcomLaw days ({len(c_days)}): {min(int(d) for d in c_days)} to {max(int(d) for d in c_days)}")

# Check Day 41 in both
b_d41 = re.search(r'"day":\s*41[^{]*?"title":\s*"([^"]+)"', b_txt)
c_d41 = re.search(r'"day":\s*41[^{]*?"title":\s*"([^"]+)"', c_txt)

print(f"Branch B Day 41 title: {b_d41.group(1) if b_d41 else 'None'}")
print(f"Branch C Day 41 title: {c_d41.group(1) if c_d41 else 'None'}")
