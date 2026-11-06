import os, glob, re, json

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Mapping between course ID or prefix and file in src/lib/data
data_dir = 'src/lib/data'
files = glob.glob(os.path.join(data_dir, '*LongLessons.ts'))

# For each file, count days <= 60
file_days = {}
for f in files:
    fname = os.path.basename(f)
    if fname == 'longLessons.ts': continue
    with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    days = re.findall(r'["\']?day["\']?\s*:\s*(\d+)', content)
    day_nums = sorted(list(set(int(d) for d in days if 1 <= int(d) <= 60)))
    file_days[fname] = len(day_nums)

print("="*80)
print(f"{'Course File':<35} | {'Days':<6} | {'Target':<6} | {'% Done':<8}")
print("="*80)

total_days_implemented = 0
total_days_target = 0

for fname, count in sorted(file_days.items()):
    target = 60
    pct = (count / target) * 100
    total_days_implemented += count
    total_days_target += target
    print(f"{fname:<35} | {count:>4}   | {target:>4}   | {pct:>6.1f}%")

print("="*80)
print(f"TOTAL DAYS IMPLEMENTED: {total_days_implemented}")
print(f"TOTAL DAYS TARGET (across files): {total_days_target}")
total_pct = (total_days_implemented / total_days_target) * 100
print(f"OVERALL COMPLETION (FILES): {total_pct:.2f}%")
print(f"OVERALL REMAINING WORK (FILES): {100 - total_pct:.2f}%")

# Now check against 37 courses * 60 = 2220 days
bible_total_days = 37 * 60
bible_pct = (total_days_implemented / bible_total_days) * 100
print("="*80)
print(f"MASTER BIBLE TOTAL DAYS (37 Courses x 60 Days): {bible_total_days}")
print(f"BIBLE COMPLETION: {bible_pct:.2f}%")
print(f"BIBLE REMAINING: {100 - bible_pct:.2f}%")
