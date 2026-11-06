import json

for d in [26, 27, 28, 29, 30]:
    fn = f'scripts/iot_net_day{d}.json'
    data = json.load(open(fn, encoding='utf-8'))
    words = [sum(len(s.split()) for s in p['say']) for p in data['parts']]
    total = sum(words)
    min_w = min(words)
    print(f"Day {d}: {data['title']}")
    print(f"  Words per part: {words}")
    print(f"  Total words: {total} | Min part: {min_w} | All >= 580: {all(w >= 580 for w in words)} | Total >= 3000: {total >= 3000}")
    print(f"  Has pure python outputs: {all(bool(p.get('output')) for p in data['parts'])}")
