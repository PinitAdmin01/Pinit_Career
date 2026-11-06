import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/soft_skills_month2_batch3_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

cards = text.split('class="daily-card"')
for idx in range(1, 6):
    day_num = 40 + idx
    c = cards[idx]
    title_m = re.search(r'<strong style="margin-left: 6pt; font-size: 8.8pt; color: #312e81;">(.*?)</strong>', c)
    title = title_m.group(1).strip() if title_m else 'NO TITLE'
    print(f"\n==================== DAY {day_num}: {title} ====================")
    quests = re.findall(r'<span style="font-family: monospace; font-size: 6.8pt; background: #ede9fe; color: #4338ca; padding: 1px 4px; border-radius: 2px;">(Q\d+\.\d+)</span>\s*<br/>\s*<strong style="font-size: 8pt; color: #1e1b4b;">(.*?)</strong>\s*<span style="font-size: 7.2pt; color: #6b7280;">\((.*?)\)</span>', c)
    for qid, qtitle, qtype in quests:
        print(f"  [{qid}] ({qtype}): {qtitle}")
