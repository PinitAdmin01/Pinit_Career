with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 44,')
part_idx = text.find('"parts": [', idx)
check_idx = text.find('"check":', part_idx)
print(text[check_idx-200:check_idx+50])
