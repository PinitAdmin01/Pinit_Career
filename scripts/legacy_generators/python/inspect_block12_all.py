import sys, re
sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/python_block12_raw.html', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.split(r'Day\s+(5[6-9]|60)</span>', text)
for i in range(1, len(days), 2):
    dnum = days[i]
    block = days[i+1]
    title = re.search(r'<strong[^>]*>([^<]+)</strong>', block).group(1).strip()
    print(f'=== DAY {dnum}: {title} ===')
    quests = re.findall(r'<div style="margin-bottom: 2px;">(.*?)</div>', block, re.S)
    for q in quests:
        clean = re.sub(r'<[^>]+>', ' ', q)
        clean = ' '.join(clean.split())
        print('  *', clean)
    print()
