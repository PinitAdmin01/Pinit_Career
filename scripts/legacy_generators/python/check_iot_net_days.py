import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/visuals/iot-network-masterclass-spec.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Find days 21 to 30 titles
days = re.findall(r'"day":\s*(2[1-9]|30),\s*"month":\s*1,\s*"blockNum":\s*(\d+),\s*"title":\s*"([^"]+)"', text)
for d, b, t in days:
    print(f"Day {d} (Block {b}): {t}")
