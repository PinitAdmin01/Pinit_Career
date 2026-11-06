import re
import json

# 1. Fix src/lib/data/nlpPythonLongLessons.ts
ts_path = 'src/lib/data/nlpPythonLongLessons.ts'
with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

new_text = re.sub(r'(\n\s*"subtitle":\s*"[^"]*",?)', '', text)
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(new_text)
print("Cleaned subtitle from nlpPythonLongLessons.ts")

# 2. Fix scripts/data_nlp_block11.json
json_path = 'scripts/data_nlp_block11.json'
with open(json_path, 'r', encoding='utf-8') as f:
    days = json.load(f)

for day in days:
    if 'subtitle' in day:
        del day['subtitle']

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(days, f, indent=2, ensure_ascii=False)
print("Cleaned subtitle from data_nlp_block11.json")

# 3. Fix day51.py to day55.py in scripts/nlp_builder/
for day_num in range(51, 56):
    py_path = f'scripts/nlp_builder/day{day_num}.py'
    with open(py_path, 'r', encoding='utf-8') as f:
        py_text = f.read()
    new_py_text = re.sub(r'(\n\s*"subtitle":\s*"[^"]*",?)', '', py_text)
    with open(py_path, 'w', encoding='utf-8') as f:
        f.write(new_py_text)
    print(f"Cleaned subtitle from day{day_num}.py")
