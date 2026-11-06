with open('src/lib/data/distributedWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('"day": 30')
print(text[idx:idx+800].encode('ascii', 'ignore').decode('ascii'))
