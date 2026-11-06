import re

courses = [
    ('sqlLongLessons.ts', 'src/lib/data/sqlLongLessons.ts'),
    ('dsaPythonLongLessons.ts', 'src/lib/data/dsaPythonLongLessons.ts'),
    ('devopsWebLongLessons.ts', 'src/lib/data/devopsWebLongLessons.ts')
]

for name, path in courses:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    m = re.findall(r'"day":\s*(\d+)', text)
    u = re.findall(r'\bday:\s*(\d+)', text)
    all_d = [int(x) for x in m + u]
    print(f"{name}: Total {len(all_d)} days. Range: {min(all_d) if all_d else 0} to {max(all_d) if all_d else 0}")
