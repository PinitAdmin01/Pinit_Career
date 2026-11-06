with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for d in [46, 47, 48, 49, 50]:
    idx = text.find(f'"day": {d},')
    next_idx = text.find(f'"day": {d+1},') if d < 50 else len(text)
    d_chunk = text[idx:next_idx]
    has_summary = '"summary":' in d_chunk
    has_project = '"projectStep":' in d_chunk
    print(f"Day {d}: has_summary={has_summary}, has_projectStep={has_project}")
