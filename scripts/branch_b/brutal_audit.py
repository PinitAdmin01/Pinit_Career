"""
Brutal, 100% Honest, Zero-Hallucination Audit across all 7 Branch B Commerce Courses.
Checks:
- Course 01: bcom_acc
- Course 02: bcom_fin
- Course 03: bcom_mkt
- Course 04: bcom_aud
- Course 05: bcom_ban
- Course 06: bcom_dmkt
- Course 07: bcom_ecom
"""
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

courses = [
    {"prefix": "bcom_acc", "file": "src/lib/data/bcomAccountingLongLessons.ts", "vis_prefix": "bcom_acc"},
    {"prefix": "bcom_fin", "file": "src/lib/data/bcomFinanceLongLessons.ts", "vis_prefix": "bcom_fin"},
    {"prefix": "bcom_mkt", "file": "src/lib/data/bcomMktLongLessons.ts", "vis_prefix": "bcom_mkt"},
    {"prefix": "bcom_aud", "file": "src/lib/data/bcomAudLongLessons.ts", "vis_prefix": "bcom_aud"},
    {"prefix": "bcom_ban", "file": "src/lib/data/bcomBanLongLessons.ts", "vis_prefix": "bcom_ban"},
    {"prefix": "bcom_dmkt", "file": "src/lib/data/bcomDmktLongLessons.ts", "vis_prefix": "bcom_dmkt"},
    {"prefix": "bcom_ecom", "file": "src/lib/data/bcomEcomLongLessons.ts", "vis_prefix": "bcom_ecom"},
]

print("================================================================================")
print("             BRUTAL ZERO-HALLUCINATION AUDIT OF BRANCH B (COURSES 1-7)          ")
print("================================================================================\n")

total_courses = len(courses)
overall_defects = []

for c in courses:
    prefix = c["prefix"]
    fpath = c["file"]
    vis_dir = os.path.join("src/lib/data/lessonVisuals", c["vis_prefix"])
    
    print(f"--> Auditing Course: {prefix} ({fpath})")
    if not os.path.exists(fpath):
        print(f"  [CRITICAL ERROR] File does not exist: {fpath}")
        overall_defects.append(f"{prefix}: File missing")
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        text = f.read()
    
    # 1. Day presence
    days_found = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text)
    day_ints = [int(x) for x in days_found]
    unique_days = sorted(list(set(day_ints)))
    
    missing_days = [d for d in range(1, 61) if d not in unique_days]
    print(f"  Day Range: min={min(unique_days) if unique_days else 0}, max={max(unique_days) if unique_days else 0}, total unique={len(unique_days)}")
    if missing_days:
        print(f"  [DEFECT] Missing Days: {missing_days}")
        overall_defects.append(f"{prefix}: Missing days {missing_days}")
    else:
        print(f"  [OK] All 60 Days present (1 to 60)")
    
    # Check duplicate top-level days
    from collections import Counter
    counts = Counter(day_ints)
    dups = [d for d, cnt in counts.items() if cnt > 1]
    if dups:
        print(f"  [DEFECT] Duplicate Days: {dups}")
        overall_defects.append(f"{prefix}: Duplicate days {dups}")
    else:
        print(f"  [OK] Zero duplicate days")
    
    # 2. Check Visuals directory
    missing_visuals = []
    digit_captions = []
    unclosed_captions = []
    too_long_captions = []
    
    # Check Month 2 visuals (Days 31 to 60)
    for d in range(31, 61):
        vfile = os.path.join(vis_dir, f"day-{d}.json")
        if not os.path.exists(vfile):
            missing_visuals.append(d)
        else:
            try:
                with open(vfile, "r", encoding="utf-8") as vf:
                    vdata = json.load(vf)
                for entry in vdata.get("entries", []):
                    for step in entry.get("spec", {}).get("steps", []):
                        cap = step.get("caption", "")
                        if re.search(r'\d', cap):
                            digit_captions.append((d, cap))
                        if not cap.endswith('.'):
                            unclosed_captions.append((d, cap))
                        if len(cap) > 75:
                            too_long_captions.append((d, len(cap), cap))
            except Exception as e:
                overall_defects.append(f"{prefix} Day {d} visual parse error: {e}")
    
    if missing_visuals:
        print(f"  [DEFECT] Missing Visual Envelopes for Month 2: {missing_visuals}")
        overall_defects.append(f"{prefix}: Missing visuals {missing_visuals}")
    else:
        print(f"  [OK] All Month 2 Visual Envelopes (Days 31-60) exist on disk")
        
    if digit_captions:
        print(f"  [DEFECT] Captions containing digits in Month 2: {len(digit_captions)} instances")
        overall_defects.append(f"{prefix}: {len(digit_captions)} captions with digits")
    else:
        print(f"  [OK] Zero numeric digits in visual captions")
        
    if unclosed_captions:
        print(f"  [DEFECT] Captions missing trailing period: {len(unclosed_captions)} instances")
        overall_defects.append(f"{prefix}: {len(unclosed_captions)} captions without period")
    else:
        print(f"  [OK] All captions period-terminated")
        
    if too_long_captions:
        print(f"  [DEFECT] Captions exceeding 75 chars: {len(too_long_captions)} instances")
        overall_defects.append(f"{prefix}: {len(too_long_captions)} captions > 75 chars")
    else:
        print(f"  [OK] All captions <= 75 chars")

    print("")

print("================================================================================")
print(f"TOTAL DEFECTS FOUND: {len(overall_defects)}")
for d in overall_defects:
    print(f" - {d}")
print("================================================================================")
