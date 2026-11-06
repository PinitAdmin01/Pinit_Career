import json
with open('src/lib/data/lessonVisuals/java-basics/day-31.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
entry0 = d['entries'][0]
print("day-31 entry 0 spec template:", entry0['spec']['template'])
print("day-31 entry 0 steps count:", len(entry0['spec']['steps']))
print("day-31 entry 0 step 'at's:", [s['at'] for s in entry0['spec']['steps']])
print("day-31 entry 0 step 0:", entry0['spec']['steps'][0])
