with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [line for line in text.splitlines() if 'react' in line.lower()]
print('Matches for "react" in longLessons.ts:')
for m in matches[:25]:
    print(' ', m)
