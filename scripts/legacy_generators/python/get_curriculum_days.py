import re

with open("src/lib/data/courseCurriculum.ts", "r", encoding="utf-8") as f:
    text = f.read()

m = re.search(r"id:\s*['\"]git_vcs['\"][\s\S]*?days:\s*\[([\s\S]*?)\]\s*,\s*certification", text)
if m:
    days_block = m.group(1)
    day_matches = re.findall(r"day:\s*(\d+)[\s\S]*?title:\s*['\"]([^'\"]+)['\"]", days_block)
    for day_num, title in day_matches:
        print(f"Day {day_num}: {title}")
else:
    print("git_vcs not found")
