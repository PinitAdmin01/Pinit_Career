with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for l in lines[75:125]:
    print(l, end='')
