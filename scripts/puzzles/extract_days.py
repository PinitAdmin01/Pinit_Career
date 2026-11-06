import re
with open(r'c:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\pythonLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()
# More flexible pattern
matches = re.findall(r'day:\s*(\d+)\s*,.*?title:\s*(?:[`"\'])(.+?)(?:[`"\'])\s*,', content, re.DOTALL)
seen = set()
for day, title in sorted(matches, key=lambda x: int(x[0])):
    d = int(day)
    if d not in seen and d <= 60:
        seen.add(d)
        print(f"Day {d:>2}: {title}")
print(f"\nTotal unique days found: {len(seen)}")
missing = set(range(1,61)) - seen
if missing:
    print(f"Missing days: {sorted(missing)}")
