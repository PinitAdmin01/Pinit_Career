import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('39.2 Month 2: Distributed Topology')
end_pos = html.find('Day 36', pos)
part_html = html[pos:end_pos]

with open('scripts/git_month2_batch1_bible.txt', 'w', encoding='utf-8') as out:
    out.write(part_html)

print("Saved scripts/git_month2_batch1_bible.txt successfully!")
