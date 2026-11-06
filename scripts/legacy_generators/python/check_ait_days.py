with open('src/lib/data/bcomAitLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'day:' in line or '"day":' in line:
        print(f"Line {i+1}: {line.strip()}")
