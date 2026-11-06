"""
Master Assembly & Verification Script for Course 26 Completion (bcom_ban Days 21 to 30)
Encompasses Batch 1 (Days 21-25 / Milestone 5) & Batch 2 (Days 26-30 / Milestone 6 Grand Final Capstone)
Generates on-disk Gate v2 visuals, appends to bcomBanLongLessons.ts, and verifies invariants.
"""

import os
import sys
import json
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bcom_ban_day21_builder import build_day21
from bcom_ban_day22_builder import build_day22
from bcom_ban_day23_builder import build_day23
from bcom_ban_day24_builder import build_day24
from bcom_ban_day25_builder import build_day25
from bcom_ban_day26_builder import build_day26
from bcom_ban_day27_builder import build_day27
from bcom_ban_day28_builder import build_day28
from bcom_ban_day29_builder import build_day29
from bcom_ban_day30_builder import build_day30
from visual_builder import generate_ledger_sheet_visual, count_words

days = [
    build_day21(),
    build_day22(),
    build_day23(),
    build_day24(),
    build_day25(),
    build_day26(),
    build_day27(),
    build_day28(),
    build_day29(),
    build_day30()
]

print("=== AUDIT OF ALL 10 TASKS (DAYS 21 TO 30) ===")
total_all_10_words = 0
for d in days:
    day_num = d["day"]
    w = count_words([p["say"] for p in d["parts"]])
    total_all_10_words += w
    part_words = [count_words(p["say"]) for p in d["parts"]]
    print(f"Day {day_num:02d}: {w} words | Parts: {part_words}")
    assert w >= 2950, f"Day {day_num} failed word budget: {w} < 2950"
    for idx, pw in enumerate(part_words):
        assert pw >= 580, f"Day {day_num} Part {idx+1} failed word budget: {pw} < 580"

print(f"\nTotal Spoken Words Across Days 21-30: {total_all_10_words} (Average: {total_all_10_words/10:.1f} words/day)\n")

# Step 2: Generate all 10 on-disk visual JSON specs
print("=== GENERATING ON-DISK VISUAL SPECS FOR DAYS 21-30 ===")
visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_ban")
os.makedirs(visuals_dir, exist_ok=True)

for d in days:
    day_num = d["day"]
    padded = f"day-{day_num:02d}.json"
    target_path = os.path.join(visuals_dir, padded)
    
    entries = [{"title": p["title"], "code": p["code"]} for p in d["parts"]]
    visual_spec = generate_ledger_sheet_visual("bcom_ban", day_num, entries)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(visual_spec, f, indent=2)
    print(f"Created visual spec: {target_path} (entries: {len(visual_spec['entries'])})")

# Step 3: Append Days 21-30 to bcomBanLongLessons.ts
print("\n=== APPENDING DAYS 21-30 TO bcomBanLongLessons.ts ===")
target_ts_file = os.path.join("src", "lib", "data", "bcomBanLongLessons.ts")

with open(target_ts_file, "r", encoding="utf-8") as f:
    ts_content = f.read()

existing_days = sorted(list(set(map(int, re.findall(r'"?day"?:\s*(\d+)', ts_content)))))
print(f"Pre-existing days in file: {existing_days}")

# Identify which days from 21-30 need appending
days_to_append = [d for d in days if d["day"] not in existing_days]
print(f"Days to append: {[d['day'] for d in days_to_append]}")

if days_to_append:
    new_days_ts = [json.dumps(d, indent=2) for d in days_to_append]
    match = list(re.finditer(r'\];', ts_content))
    if not match:
        raise ValueError("Could not find closing ]; in bcomBanLongLessons.ts")
    last_bracket = match[-1]
    insertion_point = last_bracket.start()
    
    combined_new_days = ",\n" + ",\n".join(new_days_ts) + "\n"
    new_ts_content = ts_content[:insertion_point].rstrip() + combined_new_days + "];\n"
    
    with open(target_ts_file, "w", encoding="utf-8") as f:
        f.write(new_ts_content)
    print(f"Successfully appended Days {[d['day'] for d in days_to_append]} into bcomBanLongLessons.ts!")
else:
    print("All Days 21-30 already present in bcomBanLongLessons.ts, skipping append.")

# Step 4: Verify post-append state
with open(target_ts_file, "r", encoding="utf-8") as f:
    verified_content = f.read()

updated_days = sorted(list(set(map(int, re.findall(r'"?day"?:\s*(\d+)', verified_content)))))
print(f"Updated days in bcomBanLongLessons.ts: {updated_days}")
assert set(range(1, 31)).issubset(set(updated_days)), f"Not all Days 1-30 are present in bcomBanLongLessons.ts! Found: {updated_days}"
print("\n=== COURSE 26 ALL 30 DAYS SUCCESSFULLY ASSEMBLED AND VERIFIED! ===")
