with open('src/lib/data/coursesData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'id:\s*["\']([^"\']+)["\'].*?title:\s*["\']([^"\']+)["\']', text, re.DOTALL)
print(f"Total courses in coursesData.ts: {len(matches)}")
for cid, title in matches:
    print(f"  * {cid:<30} | {title}")
