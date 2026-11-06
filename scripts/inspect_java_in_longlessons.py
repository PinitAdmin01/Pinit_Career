with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for idx, l in enumerate(lines):
    if "'java-basics'" in l:
        for j in range(max(0, idx - 2), min(len(lines), idx + 5)):
            print(f"{j+1}: {lines[j]}")
