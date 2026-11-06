import re

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'day:\s*1,.*?(?=day:\s*2,)', text, re.DOTALL)
if m:
    day1 = m.group(0)
    titles = re.findall(r'title:\s*[\'"]([^\'"]+)[\'"]', day1)
    for i, t in enumerate(titles):
        print(f"Part {i}: {t}")
