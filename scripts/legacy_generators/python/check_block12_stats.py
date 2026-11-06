import json

# Check how Day 51 to 55 represent say
with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines[-200:]):
    if 'say:' in line or '"say":' in line:
        print(f"Line: {line.strip()[:60]}")
        break

for d in range(56, 61):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    words = []
    for p in data['parts']:
        s = p['say']
        if isinstance(s, list):
            text = " ".join(s)
        else:
            text = s
        words.append(len(text.split()))
    total = sum(words)
    mins = data.get('minutes', 0)
    print(f"Day {d}: Total words={total}, mins={mins}, parts words={words}, spoken_time={total/120:.1f}m")
