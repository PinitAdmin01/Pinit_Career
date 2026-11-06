with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for idx, l in enumerate(lines):
    if "JAVA_BASICS_LONG_LESSONS" in l:
        print(f"{idx+1}: {l}")
