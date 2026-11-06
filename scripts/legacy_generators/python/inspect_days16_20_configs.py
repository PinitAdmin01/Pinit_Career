import re

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\bcomAccounting30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for DayConfig entries
# "day": 16,
matches = re.finditer(r'"day":\s*(\d+),', text)
indices = [m.start() for m in matches]
indices.append(len(text))

# Parse chunks
for i in range(len(indices)-1):
    chunk = text[indices[i]:indices[i+1]]
    day_m = re.search(r'"day":\s*(\d+)', chunk)
    if day_m:
        d = int(day_m.group(1))
        if 16 <= d <= 20:
            title_m = re.search(r'"title":\s*"([^"]+)"', chunk)
            desc_m = re.search(r'"desc":\s*"([^"]+)"', chunk)
            print(f"=== DAY {d}: {title_m.group(1) if title_m else 'N/A'} ===")
            print(f"Desc: {desc_m.group(1) if desc_m else 'N/A'}")
            
            # extract syllabus
            syl_m = re.search(r'"syllabus":\s*\[(.*?)\]', chunk, re.DOTALL)
            if syl_m:
                syl_items = re.findall(r'"([^"]+)"', syl_m.group(1))
                print("Syllabus:")
                for item in syl_items:
                    print(f"  - {item}")
            print()
