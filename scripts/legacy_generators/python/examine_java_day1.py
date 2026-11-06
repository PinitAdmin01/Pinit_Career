import re

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find Day 1
m = re.search(r'day:\s*1,.*?(?=day:\s*2,)', text, re.DOTALL)
if m:
    day1 = m.group(0)
    print("DAY 1 LENGTH:", len(day1))
    # Look for Virtual Threads
    vt_matches = [line.strip() for line in day1.split('\n') if 'virtual thread' in line.lower() or 'autocloseable' in line.lower()]
    print(f"Matches ({len(vt_matches)}):")
    for l in vt_matches[:5]:
        print(" ", l[:120])
