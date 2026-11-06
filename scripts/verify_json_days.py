import json

for d in range(36, 51):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"Day {d}: {data['title'][:50]}... ({data.get('minutes')} mins, {len(data['parts'])} parts)")
