import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

pos = html.find('39.2 Month 2: Distributed Topology')
end_pos = html.find('Part XL:', pos)
part_html = html[pos:end_pos]

# Find day blocks
day_matches = list(re.finditer(r'<span[^>]*>\s*Day\s+(\d+)\s*</span>\s*<strong[^>]*>([^<]+)</strong>', part_html))
print(f"Total Day cards found in Part XXXIX: {len(day_matches)}")

for m in day_matches[:10]:
    d_num = m.group(1)
    title = m.group(2).strip()
    print(f"Day {d_num}: {title}")
