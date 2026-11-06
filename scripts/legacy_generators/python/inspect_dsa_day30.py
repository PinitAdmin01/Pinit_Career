with open('src/lib/data/dsaPythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for marker in ['"day": 30', 'day: 30']:
    idx = text.rfind(marker)
    if idx != -1:
        print(f"Found marker {marker} at {idx}")
        print(text[idx:idx+1200].encode('ascii', errors='replace').decode('ascii'))
        break
