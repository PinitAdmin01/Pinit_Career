with open('src/lib/data/longLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("Length of longLessons.ts:", len(text))
import re
m = re.search(r'function getLongLesson[\s\S]*?\{([\s\S]*?)\n\}', text)
if m:
    print("getLongLesson:", m.group(0)[:800])
