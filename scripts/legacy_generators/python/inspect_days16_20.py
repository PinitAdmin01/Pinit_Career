import re

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\bcomAccounting30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match day blocks
blocks = re.split(r'\{\s*day:\s*(\d+),', text)
for i in range(1, len(blocks), 2):
    d_num = int(blocks[i])
    content = blocks[i+1]
    if 16 <= d_num <= 20:
        title_m = re.search(r'title:\s*["\']([^"\']+)["\']', content)
        sub_m = re.search(r'subtitle:\s*["\']([^"\']+)["\']', content)
        title = title_m.group(1) if title_m else "N/A"
        sub = sub_m.group(1) if sub_m else "N/A"
        print(f"=== DAY {d_num}: {title} ===")
        print(f"Subtitle: {sub}")
        
        # Look for topics / topics covered
        topics_m = re.findall(r'["\']([^"\']+)["\']', content[:1500])
        print("First few strings:", topics_m[:10])
        print()
