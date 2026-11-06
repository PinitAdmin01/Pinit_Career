with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('LONG_LESSON_LANGUAGE')
idx_end = text.find('};', idx)
print(text[idx:idx_end+2])
