import json
import glob

for path in sorted(glob.glob('scripts/iot_emb_day*.json')):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    day = data.get('day')
    mins = data.get('minutes')
    parts = data.get('parts', [])
    print(f"=== {path} (Day {day}, {mins} mins, {len(parts)} parts) ===")
    for idx, p in enumerate(parts):
        words = sum(len(s.split()) for s in p.get('say', []))
        print(f"  Part {idx+1}: {words} words (target >= 580), say count: {len(p.get('say', []))}")
