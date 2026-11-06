import os, json

for d in range(41, 46):
    f = f'scripts/iot_emb_day{d}.json'
    if os.path.exists(f):
        data = json.load(open(f, 'r', encoding='utf-8'))
        part_words = [sum(len(s.split()) for s in p['say']) for p in data['parts']]
        total_w = sum(part_words)
        print(f"Day {d}: exists, title={data.get('title')}, minutes={data.get('minutes')}, words={total_w}, parts={part_words}")
    else:
        print(f"Day {d}: NOT FOUND")
