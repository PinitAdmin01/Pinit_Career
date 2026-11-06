import glob
import re
import os

print(f"{'File':<45} | {'Count':<6} | {'Range':<10} | {'Status'}")
print("-" * 75)

for f in sorted(glob.glob("src/lib/data/*LongLessons.ts")):
    with open(f, "r", encoding="utf-8") as fp:
        txt = fp.read()
    days = [int(m) for m in re.findall(r'"day":\s*(\d+)', txt)]
    basename = os.path.basename(f)
    if days:
        status = "GRADUATED (60/60)" if len(days) == 60 else f"IN PROGRESS ({len(days)}/60)"
        print(f"{basename:<45} | {len(days):<6} | {min(days)}-{max(days):<8} | {status}")
    else:
        print(f"{basename:<45} | 0      | None       | EMPTY")
