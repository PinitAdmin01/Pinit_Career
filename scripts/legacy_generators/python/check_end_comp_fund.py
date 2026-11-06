with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos_close = text.rfind('\n];')
print('Closing pos:', pos_close, 'Length:', len(text))
pos16 = text.find('"day": 16,')
print('Day 16 pos:', pos16)
