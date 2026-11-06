with open('src/lib/data/reactLongLessons.ts', encoding='utf-8') as f:
    text = f.read()

idx = text.find('56')
while idx != -1:
    sub = text[max(0, idx-10):idx+50]
    if 'day' in sub or '"day"' in sub:
        print('Found day 56 at', idx)
        print(text[idx-20:idx+200])
        break
    idx = text.find('56', idx+1)
