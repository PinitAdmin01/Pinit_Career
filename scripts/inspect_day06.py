import json

with open('scratch/day06_node.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print('Day:', d['day'], 'Title:', d['title'], 'Parts:', len(d['parts']))
for i, p in enumerate(d['parts']):
    words = sum(len(s.split()) for s in p['say'])
    print(f"  Part {i+1}: {p['title']} ({words} words)")
