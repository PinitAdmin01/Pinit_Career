with open('src/lib/data/g3dLongLessons.ts', 'r', encoding='utf-8') as f:
    t = f.read()
i = t.find('"day": 55')
print(t[i:i+400])
