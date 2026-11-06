with open('src/lib/data/softSkillsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\b(?:production invariant|telemetry invariant|distributed invariant|heterogeneous distributed invariant)[^,.]*)', text, re.IGNORECASE)
print(f"softSkillsLongLessons matches: {len(matches)}")
for m in matches[:5]:
    print("Sample:", m)
