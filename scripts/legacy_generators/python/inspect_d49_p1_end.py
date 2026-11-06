with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 49,')
p_idx = text.find('"parts": [', idx)
p2_idx = text.find('"title": "Micro-Batching', p_idx)
print(text[p2_idx-600:p2_idx])
