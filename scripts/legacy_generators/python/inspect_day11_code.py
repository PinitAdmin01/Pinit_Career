import json

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos11 = text.find('"day": 11,')
start = text.rfind('{', 0, pos11)
pos12 = text.find('"day": 12,', pos11)
end = text.rfind('}', start, pos12) + 1
d11 = json.loads(text[start:end])
for i, p in enumerate(d11['parts']):
    print(f"=== Day 11 Part {i+1}: {p['title']} ===")
    print(p['code'])
    print("Expected Output:")
    print(p['output'])
    print()
