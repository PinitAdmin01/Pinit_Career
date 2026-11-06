with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'Course 18|iot_net', text)]
for m in matches[-10:]:
    print(text[m:m+150].replace('\n', ' '))
    print('---')
