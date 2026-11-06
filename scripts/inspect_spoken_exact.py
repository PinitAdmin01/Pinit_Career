with open('src/lib/data/longLessonTypes.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for j in range(140, 155):
    print(f"{j+1}: {lines[j]}")
