import json
with open('src/lib/data/lessonVisuals/java-basics/day-31.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print("day-31 schemaVersion:", d.get('schemaVersion'))
print("day-31 prefix:", d.get('prefix'))
print("day-31 day:", d.get('day'))
