with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 46')
print("idx:", idx)
print(repr(text[idx-50:idx+50]))
