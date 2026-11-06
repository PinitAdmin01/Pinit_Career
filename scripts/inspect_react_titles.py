with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'["\']?day["\']?\s*:\s*(\d+).*?["\']?title["\']?\s*:\s*["\']([^"\']+)["\']', text, re.DOTALL)
for day, title in matches:
    if 30 <= int(day) <= 60:
        print(f'Day {int(day):>2}: {title}')
