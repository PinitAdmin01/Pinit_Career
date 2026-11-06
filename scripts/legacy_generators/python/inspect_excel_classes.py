import json

with open('src/lib/data/excelVizLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find export const EXCEL_VIZ_LONG_LESSONS: LongLesson[] = [ ... ];
# Let's inspect Day 27 directly:
idx27 = text.find('"day": 27,')
idx28 = text.find('"day": 28,')
day27_str = text[idx27-1:idx28-2].strip()
if day27_str.endswith(','):
    day27_str = day27_str[:-1]

d27 = json.loads(day27_str)
print("Day 27 parts:")
for i, p in enumerate(d27['parts']):
    print(f"Part {i+1}: {p['title']}")
    # print first 100 chars of code:
    print("  Code start:", p['code'][:100].replace('\n', ' '))
