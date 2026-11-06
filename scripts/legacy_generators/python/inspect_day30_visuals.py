import json

with open('src/lib/data/lessonVisuals/bcom-accounting/day-30.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print('promptSha:', d.get('promptSha'))
print('model:', d.get('model'))
for i, e in enumerate(d['entries']):
    pt = e['partTitle'][:40]
    tmpl = e['spec']['template']
    sc = len(e['spec']['steps'])
    print(f"Entry {i}: partTitle='{pt}', template='{tmpl}', steps={sc}")
