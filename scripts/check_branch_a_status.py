import os, sys, json, re
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(__file__))

print("=" * 60)
print("BRANCH A: LAUNCHPAD & TECH TRACK CURRICULUM STATUS REPORT")
print("=" * 60)

courses = [
    ("Course 21", "excel_viz", "src/lib/data/excelVizLongLessons.ts", 30),
    ("Course 22", "git_vcs", "src/lib/data/gitVcsLongLessons.ts", 30),
    ("Course 23", "comp_fund", "src/lib/data/compFundLongLessons.ts", 30),
    ("Course 24", "soft_skills", "src/lib/data/softSkillsLongLessons.ts", 30),
]

total_days_required = 0
total_days_completed = 0

for c_num, c_id, path, target in courses:
    total_days_required += target
    if not os.path.exists(path):
        print(f"[{c_num}] {c_id:12s}: FILE MISSING ({path})")
        continue
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    days = set(int(x) for x in re.findall(r'["\']?day["\']?:\s*(\d+)', text))
    completed = len([d for d in range(1, target + 1) if d in days])
    total_days_completed += completed
    pct = (completed / target) * 100
    print(f"[{c_num}] {c_id:12s}: {completed:2d} / {target:2d} Days ({pct:6.2f}%) {'[COMPLETE 100%]' if completed == target else '[IN PROGRESS]'}")

print("-" * 60)
overall_pct = (total_days_completed / total_days_required) * 100
print(f"TOTAL BRANCH A PROGRESS: {total_days_completed} / {total_days_required} Days ({overall_pct:.2f}%)")
if total_days_completed == total_days_required:
    print("🏆 BRANCH A IS 100.00% COMPLETE! ZERO WORK REMAINING ON THIS BRANCH!")
else:
    print(f"Remaining Work: {total_days_required - total_days_completed} Days ({100 - overall_pct:.2f}%)")
print("=" * 60)
