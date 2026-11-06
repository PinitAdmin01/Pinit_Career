with open('src/lib/data/dsaWebLongLessons.ts', encoding='utf-8') as f:
    text = f.read()

pos34 = text.find('"day": 34')
pos35 = text.find('"day": 35')
print('pos34:', pos34, 'pos35:', pos35)
print('--- Day 34 end ---')
print(text[pos35-400:pos35])
print('--- Day 35 end ---')
print(text[-600:])
