# scripts/inspect_day45.py
with open('src/lib/data/bcomLawLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('day: 45')
if idx == -1:
    idx = text.find('"day": 45')
print('Found at index:', idx)
print(text[idx-40:idx+250])
