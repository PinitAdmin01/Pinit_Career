import re

with open("src/lib/data/mobileLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = re.findall(r'["\']?day["\']?:\s*(\d+)', text)
int_days = sorted(list(set(int(d) for d in days)))
print("Days present in mobileLongLessons.ts:", int_days)
