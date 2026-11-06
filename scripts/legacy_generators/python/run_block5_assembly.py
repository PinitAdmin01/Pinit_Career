# Block 5 Master Assembly & Verification Script (Days 26-30 & Milestone 6 Grand Final Capstone)
import os
import sys
import json
import re

# Ensure scripts directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from day26_builder import DAY_26
from day27_builder import DAY_27
from day28_builder import DAY_28
from day29_builder import DAY_29
from day30_builder import DAY_30
from budget_ensurer import ensure_day_budget
from visual_builder import generate_funnel_visual, count_words

days = [DAY_26, DAY_27, DAY_28, DAY_29, DAY_30]

# Step 1: Ensure Budgets and Audit
print("=== STEP 1: ENSURING BUDGETS ACROSS DAYS 26-30 ===")
total_block5_words = 0
for d in days:
    total_w = ensure_day_budget(d)
    total_block5_words += total_w
    part_words = [count_words(p['say']) for p in d['parts']]
    print(f"Day {d['day']}: {total_w} words | Parts: {part_words}")
    assert total_w >= 2950, f"Day {d['day']} word budget failed: {total_w} < 2950"
    for idx, pw in enumerate(part_words):
        assert pw >= 580, f"Day {d['day']} Part {idx+1} word budget failed: {pw} < 580"
print(f"Total Block 5 Words: {total_block5_words} (Average: {total_block5_words / 5:.1f} words/day)\n")

# Step 2: Generate Visual Specs
print("=== STEP 2: GENERATING ON-DISK VISUAL SPECS ===")
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

# Step 3: Append Days 26-30 to bcomMktLongLessons.ts
print("\n=== STEP 3: APPENDING DAYS 26-30 TO bcomMktLongLessons.ts ===")
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

match = list(re.finditer(r'\];', ts_content))
if not match:
    raise ValueError("Could not find closing ]; in bcomMktLongLessons.ts")

last_bracket = match[-1]
insertion_point = last_bracket.start()

combined_new_days = ",\n" + ",\n".join(new_days_ts) + "\n"

if "day: 26" not in ts_content and '"day": 26' not in ts_content:
    new_ts_content = ts_content[:insertion_point].rstrip() + combined_new_days + "];\n"
    with open(target_ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print("Successfully appended Days 26-30 into bcomMktLongLessons.ts!")
else:
    print("Days 26-30 already present in bcomMktLongLessons.ts, skipping append.")

# Step 4: Verify post-append state
with open(target_ts_file, "r", encoding="utf-8") as f:
    verified_content = f.read()

updated_days = sorted(list(set(map(int, re.findall(r'"?day"?:\s*(\d+)', verified_content)))))
print(f"Updated days in bcomMktLongLessons.ts: {updated_days}")
assert set(range(1, 31)).issubset(set(updated_days)), "Not all Days 1-30 are present in bcomMktLongLessons.ts!"
print("=== BLOCK 5 (DAYS 26-30) ASSEMBLY COMPLETE AND VERIFIED! ===")
