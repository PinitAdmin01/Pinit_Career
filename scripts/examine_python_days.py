import re

with open('src/lib/data/pythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for day in [1, 2, 3]:
    m = re.search(r'day:\s*' + str(day) + r',.*?(?=day:\s*' + str(day+1) + r',)', text, re.DOTALL)
    if m:
        day_text = m.group(0)
        titles = re.findall(r'title:\s*[\'"]([^\'"]+)[\'"]', day_text)
        print(f"\n=== PYTHON DAY {day} ===")
        for i, t in enumerate(titles):
            print(f"  Part {i}: {t}")
