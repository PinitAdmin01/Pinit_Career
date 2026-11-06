import json
with open('src/lib/data/lessonVisuals/java-basics/day-50.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print("Keys of day-50.json:", list(d.keys()))
