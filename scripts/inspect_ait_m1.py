import re

with open('src/lib/data/bcomAitLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = sorted(list(set(int(x) for x in re.findall(r'(?:["\']day["\']|day)\s*:\s*(\d+)', text))))

print(f"Days in bcomAit: {len(days)}: {days}")
print(f"Sample Titles:")
for t in titles[:10]:
    print(" -", t)
print("...")
for t in titles[-10:]:
    print(" -", t)
