# scripts/audit_branch_a_month2.py
import glob
import re

ts_files = glob.glob("src/lib/data/*LongLessons.ts")

print(f"{'LongLesson File':<35} {'M1 (1-30)':<12} {'M2 (31-60)':<12} {'Total Days':<10}")
print("-" * 72)

results = []
for f in sorted(ts_files):
    name = f.replace("\\", "/").split("/")[-1]
    with open(f, "r", encoding="utf-8") as fp:
        content = fp.read()
    days = re.findall(r'["\']?day["\']?:\s*(\d+)', content)
    day_nums = sorted(list(set(int(d) for d in days)))
    m1 = [d for d in day_nums if 1 <= d <= 30]
    m2 = [d for d in day_nums if 31 <= d <= 60]
    results.append((name, len(m1), len(m2), len(day_nums)))
    print(f"{name:<35} {len(m1):<12} {len(m2):<12} {len(day_nums):<10}")

m2_complete = [r for r in results if r[2] == 30]
m2_partial = [r for r in results if 0 < r[2] < 30]
m2_missing = [r for r in results if r[2] == 0]

print("\n" + "=" * 72)
print(f"Total LongLesson Files in Branch A: {len(results)}")
print(f"Month 2 100% COMPLETE (30/30 Days): {len(m2_complete)} courses")
print(f"Month 2 PARTIAL (1-29 Days):        {len(m2_partial)} courses")
print(f"Month 2 NOT STARTED (0 Days):       {len(m2_missing)} courses")
print("=" * 72)
