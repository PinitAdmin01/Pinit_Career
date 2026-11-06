import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'course-design-systems', text)]
print(f"Found {len(matches)} occurrences in PROJECT_MEMORY.md")
for idx in matches[-5:]:
    print("---")
    print(text[idx-50:idx+400])
