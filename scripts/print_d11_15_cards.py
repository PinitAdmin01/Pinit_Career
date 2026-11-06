import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = 2272725
chunk = text[idx:idx+150000]

cards = chunk.split('daily-card-header')
for c in cards:
    m = re.search(r'Day\s*(1[1-5])</span>\s*<strong[^>]*>([^<]+)</strong>', c)
    if m:
        day_num, title = m.groups()
        print(f"\n==================== Day {day_num}: {title.strip()} ====================")
        m_stage = re.search(r'class="stage-pill"[^>]*>([^<]+)</span>', c)
        if m_stage:
            print('Stage:', m_stage.group(1))
        # Quests or objectives
        m_desc = re.search(r'<em>Objective:</em>([^<]+)', c)
        if m_desc:
            print('Objective:', m_desc.group(1).strip())
        quests = re.findall(r'<strong>(Quest\s*\d+[^<]*)</strong>', c)
        for q in quests:
            print('  Quest:', q.strip())
