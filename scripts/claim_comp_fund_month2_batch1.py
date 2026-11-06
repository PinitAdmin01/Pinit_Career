# scripts/claim_comp_fund_month2_batch1.py
import sys
import os
import re
import csv
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

# 1. Extract comp_fund Month 2 Days 31-35 ground truth from PINIT_MASTER_DEBUG.html
with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('Part XXXVI: Computer Fundamentals &amp; Systems Architecture &mdash; Month 2')
if pos == -1:
    pos = html.find('36.2 Month 2:')
end_pos = html.find('Part XXXVII:', pos)
part_html = html[pos:end_pos]

day31_pos = part_html.find('Day 31')
day36_pos = part_html.find('Day 36')
block7_html = part_html[day31_pos - 200 : day36_pos if day36_pos != -1 else len(part_html)]
clean_text = re.sub(r'<[^>]+>', ' ', block7_html)
clean_text = re.sub(r'\s+', ' ', clean_text).strip()
clean_text = (clean_text
              .replace('Day 3', '\n\n=== Day 3')
              .replace('🎯', '\n🎯')
              .replace('⚠️', '\n⚠️')
              .replace('🪜', '\n🪜')
              .replace('🧩', '\n🧩')
              .replace('4 Rigorous Quests', '\n4 Rigorous Quests'))

with open('scripts/comp_fund_month2_batch1_bible.txt', 'w', encoding='utf-8') as f:
    f.write(clean_text + '\n')

print("Wrote scripts/comp_fund_month2_batch1_bible.txt")
