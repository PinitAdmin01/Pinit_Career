import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    html = f.read()

sub = html[5104380:5131233 + 10000]

for d in [46, 47, 48, 49, 50]:
    marker = f"Day {d}</span>"
    pos = sub.find(marker)
    if pos == -1:
        print(f"Day {d} NOT FOUND!")
        continue
    # find next day marker or end
    next_pos = sub.find(f"Day {d+1}</span>", pos) if d < 50 else sub.find("Day 51</span>", pos)
    if next_pos == -1:
        next_pos = pos + 6000
    card_html = sub[pos-100:next_pos]
    
    clean_text = re.sub(r'<[^>]+>', ' ', card_html)
    clean_text = clean_text.replace('&bull;', '•').replace('&rarr;', '→').replace('&amp;', '&').replace('&gt;', '>').replace('&lt;', '<')
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    
    with open(f"scripts/day_{d}_clean.txt", "w", encoding="utf-8") as out:
        out.write(clean_text)
    print(f"Day {d}: extracted {len(clean_text.split())} words into scripts/day_{d}_clean.txt")

print("All Days 46-50 clean text extracted successfully!")
