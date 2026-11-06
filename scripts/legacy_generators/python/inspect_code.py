import json

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

def get_day(d):
    pos = text.find(f'"day": {d},')
    start = text.rfind('{', 0, pos)
    next_pos = text.find(f'"day": {d+1},', pos)
    if next_pos == -1:
        next_pos = text.find('\n];', pos)
    end = text.rfind('}', start, next_pos) + 1
    return json.loads(text[start:end])

d6 = get_day(6)
print("=== DAY 6 PART 1 CODE ===")
print(d6['parts'][0]['code'])

d12 = get_day(12)
print("=== DAY 12 PART 1 CODE ===")
print(d12['parts'][0]['code'])
