import json
with open('src/lib/data/lessonVisuals/java-basics/day-26.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print("day-26 schemaVersion:", d.get('schemaVersion'))
print("number of entries:", len(d.get('entries', [])))
for e in d.get('entries', []):
    print("  entry partTitle:", e.get('partTitle'), "| codeHash:", e.get('codeHash')[:12] if e.get('codeHash') else "none")
