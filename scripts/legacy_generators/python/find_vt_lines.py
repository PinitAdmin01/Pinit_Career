with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
for idx, line in enumerate(lines[:400]):
    if 'Virtual Threads' in line:
        print(f"Line {idx}: {line[:100]}")
