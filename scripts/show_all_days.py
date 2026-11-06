with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'\{\s*"day":\s*(\d+)', text))
for i, m in enumerate(matches):
    day_num = int(m.group(1))
    title_match = re.search(r'"title":\s*"([^"]+)"', text[m.start():m.start()+300])
    title = title_match.group(1) if title_match else "No title"
    print(f"[{i:2d}] Day {day_num:2d} @ index {m.start():8d}: {title[:60]}")
