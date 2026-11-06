import re
import html

for d in range(36, 41):
    with open(f'scripts/day_{d}_raw.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip HTML tags
    clean = re.sub(r'<[^>]+>', ' ', content)
    clean = html.unescape(clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    
    with open(f'scripts/day_{d}_clean.txt', 'w', encoding='utf-8') as out:
        out.write(clean)
    print(f"Day {d} clean text: {len(clean)} chars")
