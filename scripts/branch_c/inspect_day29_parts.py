import re

with open("src/lib/data/dsaWebLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

m = re.search(r'"day":\s*29,.*?(?="day":\s*30)', text, re.DOTALL)
if m:
    day29_text = m.group(0)
    part_titles = re.findall(r'"title":\s*"([^"]+)"', day29_text)
    print(f"Day 29 titles (count {len(part_titles)}): {[t.encode('ascii', 'ignore').decode() for t in part_titles]}")
