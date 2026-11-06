import re

with open('scripts/java_block8_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

days = re.split(r'Day (\d+)</span>\s*<strong style="[^"]*">([^<]+)</strong>', text)

for i in range(1, len(days), 3):
    d_num = days[i]
    d_title = days[i+1].strip()
    d_body = days[i+2]
    
    with open(f'scripts/day_{d_num}_raw.html', 'w', encoding='utf-8') as out:
        out.write(f"<h1>Day {d_num}: {d_title}</h1>\n" + d_body)
    print(f"Wrote day_{d_num}_raw.html ({len(d_body)} chars)")
