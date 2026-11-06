# Block 198 Master Assembly & Verification Script (Course 26: bcom_ban Days 11-15 & Milestone 3 Capstone)
import os
import sys
import json
import re

# Ensure scripts directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bcom_ban_day11_builder import DAY_11
from bcom_ban_day12_builder import DAY_12
from bcom_ban_day13_builder import DAY_13
from bcom_ban_day14_builder import DAY_14
from bcom_ban_day15_builder import DAY_15
from budget_ensurer import ensure_day_budget
from visual_builder import generate_ledger_sheet_visual, count_words

days = [DAY_11, DAY_12, DAY_13, DAY_14, DAY_15]

# Step 1: Ensure Budgets and Audit
print("=== STEP 1: ENSURING BUDGETS ACROSS DAYS 11-15 ===")
total_block198_words = 0
for d in days:
    total_w = ensure_day_budget(d)
    total_block198_words += total_w
    part_words = [count_words(p['say']) for p in d['parts']]
    print(f"Day {d['day']}: {total_w} words | Parts: {part_words}")
    assert total_w >= 2950, f"Day {d['day']} word budget failed: {total_w} < 2950"
    for idx, pw in enumerate(part_words):
        assert pw >= 580, f"Day {d['day']} Part {idx+1} word budget failed: {pw} < 580"
print(f"Total Block 198 Words: {total_block198_words} (Average: {total_block198_words / 5:.1f} words/day)\n")

# Step 2: Generate Visual Specs
print("=== STEP 2: GENERATING ON-DISK VISUAL SPECS ===")
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_ban")
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
    
    visual_spec = generate_ledger_sheet_visual("bcom_ban", day_num, entries)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(visual_spec, f, indent=2)
    print(f"Created visual spec: {target_path} (entries: {len(visual_spec['entries'])})")

# Step 3: Append Days 11-15 to bcomBanLongLessons.ts
print("\n=== STEP 3: APPENDING DAYS 11-15 TO bcomBanLongLessons.ts ===")
target_ts_file = os.path.join("src", "lib", "data", "bcomBanLongLessons.ts")

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
    raise ValueError("Could not find closing ]; in bcomBanLongLessons.ts")

last_bracket = match[-1]
insertion_point = last_bracket.start()

combined_new_days = ",\n" + ",\n".join(new_days_ts) + "\n"

if "day: 11" not in ts_content and '"day": 11' not in ts_content:
    new_ts_content = ts_content[:insertion_point].rstrip() + combined_new_days + "];\n"
    with open(target_ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print("Successfully appended Days 11-15 into bcomBanLongLessons.ts!")
else:
    print("Days 11-15 already present in bcomBanLongLessons.ts, skipping append.")

# Step 4: Verify post-append state
with open(target_ts_file, "r", encoding="utf-8") as f:
    verified_content = f.read()

updated_days = sorted(list(set(map(int, re.findall(r'"?day"?:\s*(\d+)', verified_content)))))
print(f"Updated days in bcomBanLongLessons.ts: {updated_days}")
assert set(range(1, 16)).issubset(set(updated_days)), "Not all Days 1-15 are present in bcomBanLongLessons.ts!"
print("=== BLOCK 198 (DAYS 11-15) ASSEMBLY COMPLETE AND VERIFIED! ===")
