import json

with open('scripts/iot_sec_day20.json', 'r', encoding='utf-8') as f:
    d20 = json.load(f)

p5 = d20['parts'][4]
print("Day 20 Part 5 title:", p5['title'])
print("Code in Day 20 Part 5:")
print(p5['code'][:1000])
