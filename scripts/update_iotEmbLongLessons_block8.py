import json
import re

print("Loading enriched Days 36 to 40...")
enriched_days = []
for d in range(36, 41):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        enriched_days.append(json.load(f))

# Read current iotEmbLongLessons.ts
with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Locate where Day 36 starts
day36_pos = content.find("{\n    day: 36,")
if day36_pos == -1:
    day36_pos = content.find("{\n    \"day\": 36,")
if day36_pos == -1:
    day36_pos = content.find("  {\n    day: 36,")
if day36_pos == -1:
    # Let's search with regex
    m = re.search(r'\n\s*\{\s*day:\s*36\b', content)
    if m:
        day36_pos = m.start()
    else:
        m = re.search(r'\n\s*\{\s*"day":\s*36\b', content)
        if m:
            day36_pos = m.start()

print(f"Found Day 36 at index: {day36_pos}")
assert day36_pos != -1, "Could not find Day 36 in iotEmbLongLessons.ts!"

# Keep everything before Day 36
prefix = content[:day36_pos].rstrip()
if prefix.endswith(','):
    prefix = prefix[:-1]

# Convert enriched days to TypeScript array elements
ts_days = []
for day_obj in enriched_days:
    # Use json.dumps with indent 2, then format nicely
    day_json = json.dumps(day_obj, indent=4, ensure_ascii=False)
    # Remove quotes around top-level and first-level keys for cleaner TS if desired, or keep valid JSON-like TS
    ts_days.append(day_json)

new_block = ",\n  " + ",\n  ".join(ts_days) + "\n];\n"

new_content = prefix + new_block

with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully replaced Days 36-40 in src/lib/data/iotEmbLongLessons.ts!")
