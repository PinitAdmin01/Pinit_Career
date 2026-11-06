import os
import re
import json

def count_days_in_file(filepath):
    if not os.path.exists(filepath):
        return 0, set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        matches = set(int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', content))
        # Filter valid curriculum days (1 to 60)
        valid_days = {d for d in matches if 1 <= d <= 60}
        return len(valid_days), valid_days
    except Exception as e:
        return 0, set()

def audit():
    repo_a = r"C:\Users\Admin\Desktop\projects\Present-Career-os"
    repo_b = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

    dir_a = os.path.join(repo_a, "src", "lib", "data")
    dir_b = os.path.join(repo_b, "src", "lib", "data")

    files_a = set(os.listdir(dir_a)) if os.path.exists(dir_a) else set()
    files_b = set(os.listdir(dir_b)) if os.path.exists(dir_b) else set()

    all_lesson_files = sorted(files_a.union(files_b))
    all_lesson_files = [f for f in all_lesson_files if f.endswith("LongLessons.ts")]

    report = []
    total_days_a = 0
    total_days_b = 0
    total_days_union = 0

    print("=" * 85)
    print(f"{'Course LongLessons File':<35} | {'Branch A':<10} | {'Branch B':<10} | {'Combined Max'}")
    print("=" * 85)

    for f in all_lesson_files:
        path_a = os.path.join(dir_a, f)
        path_b = os.path.join(dir_b, f)

        cnt_a, set_a = count_days_in_file(path_a)
        cnt_b, set_b = count_days_in_file(path_b)

        set_union = set_a.union(set_b)
        cnt_union = len(set_union)

        total_days_a += cnt_a
        total_days_b += cnt_b
        total_days_union += cnt_union

        print(f"{f:<35} | {cnt_a:2d}/60 days | {cnt_b:2d}/60 days | {cnt_union:2d}/60 days")

    print("=" * 85)
    print(f"Total Days in Branch A (Present-Career-os)         : {total_days_a} days")
    print(f"Total Days in Branch B (Present-Career-os-commerce): {total_days_b} days")
    print(f"Total Unique Days Implemented (Union across both)  : {total_days_union} days")

    # Tier 1 (30-day baseline across 53 modules = 1,590 days)
    # Tier 2 (60-day enterprise baseline across 37 courses = 2,220 days)
    # Total Masterclass Target: 2,220 Days
    tier1_target = 1590
    tier2_target = 2220

    tier1_pct = (total_days_union / tier1_target) * 100.0
    tier1_remaining = tier1_target - total_days_union
    tier1_rem_pct = (tier1_remaining / tier1_target) * 100.0

    tier2_pct = (total_days_union / tier2_target) * 100.0
    tier2_remaining = tier2_target - total_days_union
    tier2_rem_pct = (tier2_remaining / tier2_target) * 100.0

    print("\n" + "=" * 85)
    print("MATHEMATICAL STATE OF WORK REMAINING (ACCORDING TO MASTER BIBLE PDF):")
    print("=" * 85)
    print(f"1. TIER 1 STANDARD (30-Day Foundation Masterclass - 53 Modules x 30 Days = 1,590 Days):")
    print(f"   - Completed So Far : {total_days_union:,} Days ({tier1_pct:.2f}%)")
    print(f"   - Remaining Work   : {tier1_remaining:,} Days ({tier1_rem_pct:.2f}%)")
    print(f"\n2. TIER 2 STANDARD (60-Day Full Enterprise Masterclass - 37 Courses x 60 Days = 2,220 Days):")
    print(f"   - Completed So Far : {total_days_union:,} Days ({tier2_pct:.2f}%)")
    print(f"   - Remaining Work   : {tier2_remaining:,} Days ({tier2_rem_pct:.2f}%)")
    print("=" * 85)

if __name__ == "__main__":
    audit()
