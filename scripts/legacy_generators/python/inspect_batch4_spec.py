import json, re

with open('src/lib/data/gitVersionControlPilotDays.ts', 'r', encoding='utf-8') as f:
    content = f.read()

for target_day in range(16, 21):
    pattern = rf'"day":\s*{target_day},.*?"title":\s*"([^"]+)".*?"blocks":\s*\[(.*?)\]\s*\n\s*\}}'
    m = re.search(pattern, content, re.DOTALL)
    if m:
        title = m.group(1).encode('ascii', errors='replace').decode('ascii')
        blocks_text = m.group(2)
        block_titles = re.findall(r'"title":\s*"([^"]+)"', blocks_text)
        print(f"\n=== DAY {target_day}: {title} ===")
        for bt in block_titles:
            safe_bt = bt.encode('ascii', errors='replace').decode('ascii')
            print(f"  - {safe_bt}")
    else:
        # Fallback to search day and title directly
        m2 = re.search(rf'"day":\s*{target_day},\s*"title":\s*"([^"]+)"', content)
        if m2:
            safe_t = m2.group(1).encode('ascii', errors='replace').decode('ascii')
            print(f"\n=== DAY {target_day}: {safe_t} ===")
