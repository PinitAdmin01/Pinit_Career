import json
import re

for d in range(17, 22):
    with open(f'scripts/day_{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== DAY {d}: {data['title']} ===")
    for idx, part in enumerate(data['parts']):
        code = part['code']
        last_lines = [l for l in code.strip().split('\n') if 'echo' in l or 'grep' in l or 'cat' in l][-2:]
        print(f"  Part {idx+1}: {part['title']}")
        print(f"    Check targets: {last_lines}")
