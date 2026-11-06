import json

with open('src/lib/data/lessonVisuals/node-web/day-31.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print("Keys:", list(d.keys()))
print("Entries count:", len(d.get('entries', [])))
print("Entry 0:", json.dumps(d['entries'][0], indent=2)[:600])
