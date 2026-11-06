import re
import html

with open('scripts/java_block9_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

days = re.split(r'Day (\d+)</span>\s*<strong style="[^"]*">([^<]+)</strong>', text)

for i in range(1, len(days), 3):
    d_num = days[i]
    d_title = days[i+1].strip()
    d_body = days[i+2]
    
    clean = re.sub(r'<[^>]+>', ' ', d_body)
    clean = html.unescape(clean)
    clean = re.sub(r'\s+', ' ', clean).strip()
    
    with open(f'scripts/day_{d_num}_clean.txt', 'w', encoding='utf-8') as out:
        out.write(f"Day {d_num}: {d_title}\n{clean}")
    print(f"Day {d_num}: {ascii(d_title)} ({len(clean)} chars)")
