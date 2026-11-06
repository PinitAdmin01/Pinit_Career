import re

with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    c = f.read()

for m in re.finditer(r'(?:[\'"]?day[\'"]?)\s*:\s*(4[6-9]|5[0-9]|60)', c):
    start = max(0, m.start() - 100)
    end = min(len(c), m.end() + 200)
    print(f"Match at {m.start()}: {c[start:end].encode('ascii', errors='replace').decode('ascii')}\n" + "="*50)
