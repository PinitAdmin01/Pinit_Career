import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\bcomAccounting30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'"day":\s*(\d+),', text))
for i in range(len(matches)):
    start = matches[i].start()
    end = matches[i+1].start() if i+1 < len(matches) else len(text)
    chunk = text[start:end]
    d_num = int(matches[i].group(1))
    if 21 <= d_num <= 25:
        title_m = re.search(r'"title":\s*"([^"]+)"', chunk)
        desc_m = re.search(r'"desc":\s*"([^"]+)"', chunk)
        print(f"=== DAY {d_num}: {title_m.group(1) if title_m else 'N/A'} ===")
        print(f"Desc: {desc_m.group(1) if desc_m else 'N/A'}")
        syl_m = re.search(r'"syllabus":\s*\[(.*?)\]', chunk, re.DOTALL)
        if syl_m:
            items = re.findall(r'"([^"]+)"', syl_m.group(1))
            print("Syllabus:")
            for itm in items:
                print(f"  - {itm}")
        print()
