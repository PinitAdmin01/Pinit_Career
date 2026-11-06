with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(\band verified its core production invariant\s*\([^)]*\))', text, re.IGNORECASE)
print(f"compFundLongLessons matches: {len(matches)}")
if matches:
    print("Sample match:", matches[0])
