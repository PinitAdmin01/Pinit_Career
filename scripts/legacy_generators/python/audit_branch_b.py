import os, sys, re
sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_dir = os.path.join(commerce_dir, "src", "lib", "data")

courses = [
    ("B.Com Accounting", "bcomAccountingLongLessons.ts"),
    ("B.Com Auditing", "bcomAudLongLessons.ts"),
    ("B.Com Banking & Insurance", "bcomBanLongLessons.ts"),
    ("B.Com Digital Marketing", "bcomDmktLongLessons.ts"),
    ("B.Com E-Commerce", "bcomEcomLongLessons.ts"),
    ("B.Com Entrepreneurship", "bcomEntLongLessons.ts"),
    ("B.Com Finance", "bcomFinanceLongLessons.ts"),
    ("B.Com Corporate Law", "bcomLawLongLessons.ts"),
    ("B.Com Marketing", "bcomMktLongLessons.ts"),
    ("B.Com Operations & SCM", "bcomOpsLongLessons.ts"),
    ("B.Com Sales & CRM", "bcomScrmLongLessons.ts"),
    ("B.Com Taxation", "bcomTaxLongLessons.ts"),
    ("B.Com Analytics", "bcomAnaLongLessons.ts"),
    ("B.Com AI Transformation", "bcomAitLongLessons.ts"),
    ("IoT Embedded Systems", "iotEmbLongLessons.ts"),
    ("IoT Edge AI & TinyML", "iotEdgeLongLessons.ts"),
    ("IoT Wireless Networks", "iotNetLongLessons.ts"),
    ("IoT Industrial Security", "iotSecLongLessons.ts")
]

print("=" * 65)
print("BRANCH B: COMMERCE & IOT CURRICULUM STATUS REPORT")
print("=" * 65)

total_target = len(courses) * 30
total_completed = 0

for name, fname in courses:
    path = os.path.join(data_dir, fname)
    if not os.path.exists(path):
        print(f"  {name:26s}: FILE MISSING ({fname})")
        continue
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    days = set(int(x) for x in re.findall(r'["\']?day["\']?:\s*(\d+)', text))
    completed_days = len([d for d in range(1, 31) if d in days])
    total_completed += completed_days
    pct = (completed_days / 30) * 100
    status = "[COMPLETE 30/30]" if completed_days == 30 else f"[{completed_days:2d}/30 Days]"
    print(f"  {name:26s}: {completed_days:2d} / 30 Days ({pct:5.1f}%) {status}")

print("-" * 65)
total_remaining = total_target - total_completed
overall_pct = (total_completed / total_target) * 100
print(f"BRANCH B TOTAL PROGRESS : {total_completed} / {total_target} Days ({overall_pct:.2f}%)")
print(f"BRANCH B WORK REMAINING  : {total_remaining} Days ({100 - overall_pct:.2f}%)")
print("=" * 65)
