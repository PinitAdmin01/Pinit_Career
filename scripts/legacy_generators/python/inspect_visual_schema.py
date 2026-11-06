import json

with open('src/lib/data/lessonVisuals/cloud/day-30.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Keys:", list(data.keys()) if isinstance(data, dict) else "List of length " + str(len(data)))
if isinstance(data, dict):
    print("SchemaVersion:", data.get('schemaVersion'), "Prefix:", data.get('prefix'), "Day:", data.get('day'))
    if 'parts' in data:
        print("Number of parts:", len(data['parts']))
        p0 = data['parts'][0]
        print("Part 0 keys:", list(p0.keys()))
        print("Part 0 steps:", list(p0.get('steps', {}).keys()))
elif isinstance(data, list):
    print("First item keys:", list(data[0].keys()) if data else "Empty")
