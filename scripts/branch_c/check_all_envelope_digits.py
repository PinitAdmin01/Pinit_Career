import json, re

for d in range(56, 61):
    path = f'src/lib/data/lessonVisuals/ai/day-{d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    digits_found = []
    for e_idx, entry in enumerate(data['entries']):
        spec = entry['spec']
        if re.search(r'\d', spec['title']):
            digits_found.append(f"Title: {spec['title']}")
        for col in spec['columns']:
            if re.search(r'\d', col):
                digits_found.append(f"Col: {col}")
        for step in spec['steps']:
            if re.search(r'\d', step['caption']):
                digits_found.append(f"Cap: {step['caption']}")
            for row in step['rows']:
                for cell in row:
                    if re.search(r'\d', cell):
                        digits_found.append(f"Cell: {cell}")
    if digits_found:
        print(f"Day {d} HAS DIGITS: {digits_found}")
    else:
        print(f"Day {d}: ZERO DIGITS (PERFECT!)")
