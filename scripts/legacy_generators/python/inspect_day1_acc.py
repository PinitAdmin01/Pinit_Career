with open('src/lib/data/bcomAccountingLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines[:50]:
    print(line, end='')
