import json, re

with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's count words for Days 31 to 60
days = re.split(r'\{\s*["\']?day["\']?\s*:\s*', text)[1:]
for d in days:
    m = re.match(r'(\d+)', d)
    if not m: continue
    day_num = int(m.group(1))
    if 31 <= day_num <= 60:
        # approximate word count of this day block
        words = len(re.findall(r'\b[A-Za-z0-9_-]+\b', d))
        # check parts count
        parts = len(re.findall(r'["\']?part["\']?\s*:', d))
        print(f"React Day {day_num:>2} | Words: {words:>5} | Parts: {parts}")
