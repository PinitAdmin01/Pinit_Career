import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = 2272725
chunk = text[idx:idx+150000]

cards = chunk.split('daily-card-header')
print(f'Total cards split: {len(cards)}')
for c in cards:
    m = re.search(r'Day\s*(1[1-5])</span>\s*<strong[^>]*>([^<]+)</strong>', c)
    if m:
        day_num, title = m.groups()
        print(f'=== Day {day_num}: {title.strip()} ===')
        quests = re.findall(r'<strong>(Quest\s*\d+[^<]*)</strong>', c)
        for q in quests:
            print('   ', q.strip())
