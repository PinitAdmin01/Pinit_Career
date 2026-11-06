import re

with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/promptPythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print("All days in promptPythonLongLessons.ts:")
print(days)
