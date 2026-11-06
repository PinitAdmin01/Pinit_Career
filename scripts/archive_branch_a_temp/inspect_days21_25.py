with open('content/courses/iotnetworknow.md', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'(### Day (?:2[1-9]|30).*?)(?=\n### Day |\Z)', text, re.DOTALL)
for m in matches[:5]:
    lines = m.strip().split('\n')
    print(lines[0])
    for l in lines[1:10]:
        print("  ", l)
