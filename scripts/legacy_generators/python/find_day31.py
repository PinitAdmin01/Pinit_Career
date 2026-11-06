with open('C:/Users/Admin/Desktop/projects/Present-Career-os/src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'day:\s*31\b', text)]
if matches:
    print("Found day: 31 at index", matches[0])
    print(text[matches[0]-20:matches[0]+300])
else:
    matches2 = [m.start() for m in re.finditer(r'["\']day["\']:\s*31\b', text)]
    if matches2:
        print("Found 'day': 31 at index", matches2[0])
        print(text[matches2[0]-20:matches2[0]+300])
    else:
        print("Not found with those patterns")
