import json

with open('src/lib/data/lessonVisuals/cloud/day-01.json', 'r', encoding='utf-8') as f:
    d1 = json.load(f)

print("Day 1 template:", d1['entries'][0]['spec'].get('template'))
print("Day 1 entry 0 spec keys:", list(d1['entries'][0]['spec'].keys()))

with open('src/lib/data/lessonVisuals/cloud/day-30.json', 'r', encoding='utf-8') as f:
    d30 = json.load(f)

print("Day 30 template:", d30['entries'][0]['spec'].get('template'))
print("Day 30 entry 0 spec keys:", list(d30['entries'][0]['spec'].keys()))
