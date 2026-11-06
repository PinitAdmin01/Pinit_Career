import os, re

path = 'src/lib/data/promptPythonLongLessons.ts'
print('Exists:', os.path.exists(path))
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    days = re.findall(r'"day":\s*(\d+)', text)
    unique_days = sorted(list(set(int(d) for d in days)))
    print(f"Total days found: {len(unique_days)}")
    print(f"Days: {unique_days}")
    print(f"File size: {len(text)} bytes, lines: {len(text.splitlines())}")
