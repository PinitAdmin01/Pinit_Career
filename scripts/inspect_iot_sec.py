with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos35 = text.find('"day": 35')
if pos35 == -1:
    pos35 = text.find('day: 35')

print(text[pos35:pos35+1200])
