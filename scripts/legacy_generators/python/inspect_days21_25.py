import re

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os\src\lib\data\bcomAccounting30DayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'"day":\s*(\d+),', text))
for i in range(len(matches)):
    start = matches[i].start()
    end = matches[i+1].start() if i+1 < len(matches) else len(text)
    chunk = text[start:end]
    d_num = int(matches[i].group(1))
    if 21 <= d_num <= 25:
        print(f"==================== DAY {d_num} ====================")
        print(chunk)
        print()
