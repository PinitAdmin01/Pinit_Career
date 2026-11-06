import re

with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'"day":\s*(\d+)', text):
    line_no = text[:m.start()].count('\n') + 1
    print(f'Day {m.group(1)} at line {line_no}')
