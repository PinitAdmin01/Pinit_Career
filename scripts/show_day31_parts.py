with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'day:\s*31\b', text)]
idx1 = matches[0]
matches_next = [m.start() for m in re.finditer(r'day:\s*32\b', text)]
idx2 = matches_next[0]
day31_text = text[idx1:idx2]

part_titles = re.findall(r'title:\s*["\']([^"\']+)["\']', day31_text)
print("Day 31 Part titles:")
for pt in part_titles:
    print(" -", pt)

checks = day31_text.count('check:')
print(f"Total check quizzes: {checks}")
