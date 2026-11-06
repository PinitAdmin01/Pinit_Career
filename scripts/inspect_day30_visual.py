import json

with open('src/lib/data/lessonVisuals/dist/day-30.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(json.dumps(d, indent=2)[:1000])
