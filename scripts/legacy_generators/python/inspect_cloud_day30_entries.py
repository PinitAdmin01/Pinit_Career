import json

with open('src/lib/data/lessonVisuals/cloud/day-30.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for i, e in enumerate(d['entries']):
    print(f"--- Entry {i+1}: {e['partTitle']} ---")
    spec = e['spec']
    print(f"Template: {spec.get('template')}, Title: {spec.get('title')}")
    print(f"Stages count: {len(spec.get('stages', []))}, Steps count: {len(spec.get('steps', []))}")
    if spec.get('stages'):
        print("Sample stage:", spec['stages'][0])
    if spec.get('steps'):
        print("Sample step:", spec['steps'][0])
