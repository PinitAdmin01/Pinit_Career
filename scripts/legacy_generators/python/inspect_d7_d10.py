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

d7 = get_day(7)
print("=== DAY 7 PART 1 CODE ===")
print(d7['parts'][0]['code'])

d10 = get_day(10)
print("=== DAY 10 PART 1 CODE ===")
print(d10['parts'][0]['code'])
