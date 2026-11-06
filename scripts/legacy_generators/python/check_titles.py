with open('src/lib/data/iotNetLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'"day":\s*(\d+).*?"title":\s*"([^"]+)"', text, re.DOTALL)
print(f"Total days in iotNetLongLessons.ts: {len(matches)}")
for d, t in matches[-15:]:
    print(f"Day {d}: {t}")
