import json
import re

print("Starting clean reconstruction of Days 1 to 45...")

# 1. Load enriched Block 8 (Days 36-40)
block8_days = []
for d in range(36, 41):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        block8_days.append(json.load(f))

# 2. Load enriched Block 9 (Days 41-45)
block9_days = []
for d in range(41, 46):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        block9_days.append(json.load(f))

all_enriched_36_45 = block8_days + block9_days
print(f"Loaded {len(all_enriched_36_45)} enriched days (Days 36 to 45).")

# 3. Read current iotEmbLongLessons.ts
with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 4. Find where Day 36 first appears
m = re.search(r'\n\s*\{\s*["\']?day["\']?:\s*36\b', content)
assert m, "Could not find Day 36 in iotEmbLongLessons.ts!"
day36_first_pos = m.start()

print(f"Day 36 first occurs at index {day36_first_pos}.")

# Everything before Day 36 is Days 1 to 35
prefix = content[:day36_first_pos].rstrip()
if prefix.endswith(','):
    prefix = prefix[:-1]

# 5. Format Days 36 to 45 nicely
ts_days = []
for day_obj in all_enriched_36_45:
    day_json = json.dumps(day_obj, indent=4, ensure_ascii=False)
    ts_days.append(day_json)

new_array_content = prefix + ",\n  " + ",\n  ".join(ts_days) + "\n];\n"

with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_array_content)

print("Saved clean Days 1 to 45 into src/lib/data/iotEmbLongLessons.ts!")
