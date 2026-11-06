import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/soft_skills_month2_batch3_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

cards = text.split('class="daily-card"')
for idx in range(1, 6):
    day_num = 40 + idx
    c = cards[idx]
    # find where "4 Rigorous Quests" starts
    pos = c.find("4 Rigorous Quests")
    if pos != -1:
        quest_section = c[pos:]
        clean = re.sub(r'<[^>]+>', '\n', quest_section)
        lines = [l.strip() for l in clean.split('\n') if l.strip()]
        print(f"\n==================== DAY {day_num} QUESTS ====================")
        print('\n'.join(lines[:30]))
