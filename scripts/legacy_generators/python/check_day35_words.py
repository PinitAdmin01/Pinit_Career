import json
d = json.load(open('scripts/iot_sec_day35.json', encoding='utf-8'))
for i, p in enumerate(d['parts']):
    words = len(' '.join(p['say']).split())
    print(f"Part {i+1}: {words} words, {len(p['say'])} paragraphs")
