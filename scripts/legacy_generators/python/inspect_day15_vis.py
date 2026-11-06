import json
with open('src/lib/data/lessonVisuals/java-basics/day-15.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print("day-15 keys:", list(d.keys()))
print("day-15 entry 0 step 'at's:", [s['at'] for s in d['entries'][0]['spec']['steps']])
