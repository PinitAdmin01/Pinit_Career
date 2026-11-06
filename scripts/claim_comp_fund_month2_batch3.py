import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('Part XXXVI: Computer Fundamentals &amp; Systems Architecture &mdash; Month 2')
if pos == -1:
    pos = html.find('36.2 Month 2:')
end_pos = html.find('Part XXXVII:', pos)
part_html = html[pos:end_pos]

day41_pos = part_html.find('Day 41')
day46_pos = part_html.find('Day 46')
block9_html = part_html[day41_pos - 200 : day46_pos if day46_pos != -1 else len(part_html)]
clean_text = re.sub(r'<[^>]+>', ' ', block9_html)
clean_text = re.sub(r'\s+', ' ', clean_text).strip()
clean_text = (clean_text
              .replace('Day 4', '\n\n=== Day 4')
              .replace('🎯', '\n🎯')
              .replace('⚠️', '\n⚠️')
              .replace('🪜', '\n🪜')
              .replace('🧩', '\n🧩')
              .replace('4 Rigorous Quests', '\n4 Rigorous Quests'))

with open('scripts/comp_fund_month2_batch3_bible.txt', 'w', encoding='utf-8') as f:
    f.write(clean_text + '\n')

print("Wrote scripts/comp_fund_month2_batch3_bible.txt")
