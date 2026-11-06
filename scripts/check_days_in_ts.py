import re

with open('src/lib/data/iotNetLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'day:\s*(\d+)', text)
quoted_days = re.findall(r'"day":\s*(\d+)', text)
print("Unquoted days:", [int(d) for d in days])
print("Quoted days:", [int(d) for d in quoted_days])
