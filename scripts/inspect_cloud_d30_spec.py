import json

with open('src/lib/data/lessonVisuals/cloud/day-30.json', 'r', encoding='utf-8') as f:
    d30 = json.load(f)

print(json.dumps(d30['entries'][0]['spec'], indent=2)[:1500])
