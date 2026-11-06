with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 49,')
p_idx = text.find('"parts": [', idx)
print(text[p_idx:p_idx+1200])
