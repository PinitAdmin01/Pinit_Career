with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for day_num in [46, 47, 48, 49, 50]:
    idx = text.find(f'"day": {day_num},')
    p_idx = text.find('"parts": [', idx)
    first_part_idx = text.find('{', p_idx)
    check_idx = text.find('"check":', first_part_idx)
    part_snippet = text[first_part_idx:check_idx]
    keys = re.findall(r'"([a-zA-Z0-9_]+)":', part_snippet)
    print(f"Day {day_num} Part 1 keys:", keys)
