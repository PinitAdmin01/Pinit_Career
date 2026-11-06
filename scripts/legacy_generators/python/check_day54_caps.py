import re

with open('scripts/build_day54_cloud.py', 'r', encoding='utf-8') as f:
    text = f.read()

caps = re.findall(r'"annotation":\s*"([^"]+)"', text)
for c in caps:
    if len(c) > 75:
        print(f"LEN {len(c)}: {c}")
