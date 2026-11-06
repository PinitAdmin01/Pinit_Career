import json

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('"day": 12,')
start = text.rfind('{', 0, idx)
end = text.find('];', idx)
end_obj = text.rfind('}', start, end) + 1
l = json.loads(text[start:end_obj])

total = 0
for i, p in enumerate(l['parts']):
    w = len(' '.join(p['say']).split())
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 12: {total} words (~{total/150:.1f} spoken min)")
