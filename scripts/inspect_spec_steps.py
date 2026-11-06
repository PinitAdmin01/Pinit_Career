import json

with open('src/lib/data/lessonVisuals/iot_net/day-60.json', 'r', encoding='utf-8') as f:
    iot_data = json.load(f)

print(json.dumps(iot_data['entries'][0]['spec'], indent=2)[:1000])
