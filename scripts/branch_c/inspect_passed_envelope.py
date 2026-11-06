with open('src/lib/data/lessonVisuals/dsa-optim/day-60.json', 'r', encoding='utf-8') as f:
    text = f.read()

import json
data = json.loads(text)
print("Entries count:", len(data['entries']))
print("First entry keys:", data['entries'][0].keys())
print("First entry spec keys:", data['entries'][0]['spec'].keys())
print("First step keys:", data['entries'][0]['spec']['steps'][0].keys())
print(json.dumps(data['entries'][0], indent=2)[:600])
