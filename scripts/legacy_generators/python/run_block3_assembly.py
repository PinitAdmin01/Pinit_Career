import os
import json
import re
from day16_builder import DAY_16
from day17_builder import DAY_17
from day18_builder import DAY_18
from day19_builder import DAY_19
from day20_builder import DAY_20
from budget_ensurer import ensure_day_budget
from visual_builder import generate_funnel_visual, count_words

days = [DAY_16, DAY_17, DAY_18, DAY_19, DAY_20]

# Step 1: Ensure Budgets and Audit
print("=== STEP 1: ENSURING BUDGETS ACROSS DAYS 16-20 ===")
for d in days:
    total_w = ensure_day_budget(d)
    part_words = [count_words(p['say']) for p in d['parts']]
    print(f"Day {d['day']}: {total_w} words | Parts: {part_words}")
    assert total_w >= 2950, f"Day {d['day']} word budget failed: {total_w} < 2950"
    for idx, pw in enumerate(part_words):
        assert pw >= 580, f"Day {d['day']} Part {idx+1} word budget failed: {pw} < 580"

# Step 2: Generate Visual Specs
print("\n=== STEP 2: GENERATING ON-DISK VISUAL SPECS ===")
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom-marketing")
os.makedirs(visuals_dir, exist_ok=True)

for d in days:
    day_num = d['day']
    padded = f"day-{day_num:02d}.json"
    target_path = os.path.join(visuals_dir, padded)
    
    entries = []
    for p in d['parts']:
        entries.append({
            'title': p['title'],
            'code': p['code']
        })
    
    visual_spec = generate_funnel_visual("bcom-marketing", day_num, entries)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(visual_spec, f, indent=2)
    print(f"Created visual spec: {target_path} (entries: {len(visual_spec['entries'])})")

# Step 3: Append Days 16-20 to bcomMktLongLessons.ts
print("\n=== STEP 3: APPENDING DAYS 16-20 TO bcomMktLongLessons.ts ===")
target_ts_file = os.path.join("src", "lib", "data", "bcomMktLongLessons.ts")

with open(target_ts_file, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Verify existing days
existing_days = re.findall(r'"?day"?:\s*(\d+)', ts_content)
print(f"Pre-existing days in file: {sorted(list(set(map(int, existing_days))))}")

# Format new days into TypeScript array elements
new_days_ts = []
for d in days:
    d_json = json.dumps(d, indent=2)
    new_days_ts.append(d_json)

# Find the closing ]; of the BCOM_MKT_LONG_LESSONS array
match = list(re.finditer(r'\];', ts_content))
if not match:
    raise ValueError("Could not find closing ]; in bcomMktLongLessons.ts")

last_bracket = match[-1]
insertion_point = last_bracket.start()

# Construct appended content with leading comma
combined_new_days = ",\n" + ",\n".join(new_days_ts) + "\n"

# Only insert if Day 16 is not already present
if "day: 16" not in ts_content and '"day": 16' not in ts_content:
    new_ts_content = ts_content[:insertion_point].rstrip() + combined_new_days + "];\n"
    with open(target_ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print("Successfully appended Days 16-20 into bcomMktLongLessons.ts!")
else:
    print("Days 16-20 already present in bcomMktLongLessons.ts, skipping append.")

# Step 4: Verify post-append state
with open(target_ts_file, "r", encoding="utf-8") as f:
    verified_content = f.read()

updated_days = sorted(list(set(map(int, re.findall(r'"?day"?:\s*(\d+)', verified_content)))))
print(f"Updated days in bcomMktLongLessons.ts: {updated_days}")
assert set(range(1, 21)).issubset(set(updated_days)), "Not all Days 1-20 are present in bcomMktLongLessons.ts!"
print("=== BLOCK 3 (DAYS 16-20) ASSEMBLY COMPLETE AND VERIFIED! ===")
