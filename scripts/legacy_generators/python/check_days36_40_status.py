import json
import os

for d in range(36, 41):
    f = f'scripts/iot_emb_day{d}.json'
    if os.path.exists(f):
        data = json.load(open(f, 'r', encoding='utf-8'))
        total_say_words = 0
        part_words = []
        for p in data['parts']:
            words = sum(len(s.split()) for s in p.get('say', []))
            part_words.append(words)
            total_say_words += words
        print(f"Day {d}: exists, title={data.get('title')}, declared minutes={data.get('minutes')}, total say words={total_say_words}, parts={part_words}")
    else:
        print(f"Day {d}: NOT FOUND")
