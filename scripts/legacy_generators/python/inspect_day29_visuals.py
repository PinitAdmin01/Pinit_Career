import json

with open('src/lib/data/lessonVisuals/bcom-accounting/day-29.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print('day:', d['day'])
print('prefix:', d['prefix'])
print('entries count:', len(d['entries']))
e0 = d['entries'][0]
print('partTitle:', e0['partTitle'])
print('codeHash:', e0['codeHash'])
print('spec keys:', e0['spec'].keys())
print('spec template:', e0['spec']['template'])
print('spec steps count:', len(e0['spec']['steps']))
print('step 0:', json.dumps(e0['spec']['steps'][0], indent=2))
