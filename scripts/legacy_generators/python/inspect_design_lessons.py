import re

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = sorted(list(set([int(d) for d in re.findall(r'\"day\":\s*(\d+)', text)])))
print('Total days currently in designWebLongLessons.ts:', len(days))
print('Days list:', days)
print('File length in lines:', len(text.splitlines()))
print('Last 30 lines:')
for line in text.splitlines()[-30:]:
    print(line)
