import re
import json

with open("src/lib/data/dsaWebLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = re.findall(r'"day":\s*(\d+)', text)
print(f"Existing days count: {len(days)}")
print(f"Days: {days}")

# Check coursePrefix
m = re.search(r'"coursePrefix":\s*"([^"]+)"', text)
if m:
    print(f"coursePrefix in lessons: {m.group(1)}")
else:
    print("coursePrefix not explicitly in day 1, checking gate or coursesData")
