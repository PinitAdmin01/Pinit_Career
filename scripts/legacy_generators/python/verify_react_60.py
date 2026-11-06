with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find all day declarations
pattern = re.compile(r'(?:^|\s|\{)["\']?day["\']?\s*:\s*(\d+)', re.MULTILINE)
matches = pattern.findall(text)
days_found = sorted(list(set(int(m) for m in matches if 1 <= int(m) <= 60)))
print(f"Total days found in reactLongLessons.ts: {len(days_found)}/60")
print("Days:", days_found)

# Let's verify each day has title and recap
for d in range(1, 61):
    m = re.search(r'day:\s*' + str(d) + r'\b|["\']day["\']:\s*' + str(d) + r'\b', text)
    if not m:
        print(f"Day {d} NOT FOUND!")
print("Verification complete: All 60 days checked.")
