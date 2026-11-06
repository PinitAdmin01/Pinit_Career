import json

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('"day": 13,')
start = text.rfind('{', 0, pos)
end = text.find('];', pos)
end = text.rfind('}', start, end) + 1
s = text[start:end]
lines = s.split('\n')
for idx, l in enumerate(lines[85:105], start=86):
    print(f'{idx}: {l}')

try:
    json.loads(s)
except Exception as e:
    print(f"ERROR: {e}")
