with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 45,')
parts_idx = text.find('"parts": [', idx)
print(text[parts_idx:parts_idx+500])
