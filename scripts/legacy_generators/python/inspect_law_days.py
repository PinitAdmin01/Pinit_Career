import re

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomLawLongLessons.ts', 'r', encoding='utf-8') as f:
    b_text = f.read()
b_days = sorted(set(int(x) for x in re.findall(r'day:\s*(\d+)', b_text) + re.findall(r'"day":\s*(\d+)', b_text)))
print("Branch B bcomLawLongLessons days:", len(b_days), b_days)

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\src\lib\data\bcomLawLongLessons.ts', 'r', encoding='utf-8') as f:
    c_text = f.read()
c_days = sorted(set(int(x) for x in re.findall(r'day:\s*(\d+)', c_text) + re.findall(r'"day":\s*(\d+)', c_text)))
print("Branch C bcomLawLongLessons days:", len(c_days), c_days)
