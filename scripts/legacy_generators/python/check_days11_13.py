import json

for d in [11, 12, 13]:
    with open(f'scripts/bcom_ait_day{d}_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== Day {d}: {data['title']} (Parts: {len(data['parts'])}) ===")
    total_words = 0
    for i, p in enumerate(data['parts']):
        words = sum(len(s.split()) for s in p['say'])
        total_words += words
        ans = p['check']['answerIndex']
        print(f"  Part {i+1}: words={words}, ans={ans}, title={p['title'][:40]}")
    print(f"Total words: {total_words}\n")
