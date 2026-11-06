import json

with open('src/lib/data/lessonVisuals/iot_net/day-60.json', 'r', encoding='utf-8') as f:
    iot_data = json.load(f)

print("iot_net day-60 keys:", list(iot_data.keys()))
print("iot_net day-60 schemaVersion:", iot_data.get('schemaVersion'))
if 'entries' in iot_data:
    print("Entries count:", len(iot_data['entries']))
    e0 = iot_data['entries'][0]
    print("Entry 0 keys:", list(e0.keys()))
    print("Entry 0 steps keys:", list(e0.get('steps', {}).keys()))

with open('src/lib/data/lessonVisuals/cloud/day-30.json', 'r', encoding='utf-8') as f:
    cloud_data = json.load(f)

print("\ncloud day-30 keys:", list(cloud_data.keys()))
if 'entries' in cloud_data:
    print("Cloud entries count:", len(cloud_data['entries']))
    ce0 = cloud_data['entries'][0]
    print("Cloud entry 0 keys:", list(ce0.keys()))
    print("Cloud entry 0 steps keys:", list(ce0.get('steps', {}).keys()))
