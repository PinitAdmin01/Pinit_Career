import re

with open('scripts/python_block12_raw.html', 'r', encoding='utf-8') as f:
    text = f.read()

days_raw = re.split(r'Day\s+(5[6-9]|60)</span>', text)
for i in range(1, len(days_raw), 2):
    day_num = days_raw[i]
    content = days_raw[i+1]
    title_m = re.search(r'<strong[^>]*>([^<]+)</strong>', content)
    title = title_m.group(1).strip() if title_m else 'Unknown'
    print(f'=== DAY {day_num}: {title} ===')
    quests = re.findall(r'<span[^>]*>(Q\d+\.\d+)</span>\s*<strong>([^<]+)</strong>\s*<span[^>]*>([^<]+)</span>', content)
    for q in quests:
        print(f'  {q[0]}: {q[1]} -- {q[2]}')
