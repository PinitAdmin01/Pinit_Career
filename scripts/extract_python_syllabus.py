import re, json

with open('src/lib/data/pythonLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# split on day markers (quoted or unquoted)
chunks = re.split(r'(?=\n\s*"?day"?\s*:\s*\d+\s*,)', text)
out = []
for ch in chunks:
    m = re.match(r'\n\s*"?day"?\s*:\s*(\d+)', ch)
    if not m:
        continue
    day = int(m.group(1))
    titles = re.findall(r'"?title"?\s*:\s*[\'"`]([^\'"`\n]+)[\'"`]', ch)
    out.append({'day': day, 'title': titles[0] if titles else '', 'parts': titles[1:9]})

out.sort(key=lambda x: x['day'])
seen = set()
for o in out:
    if o['day'] in seen:
        continue
    seen.add(o['day'])
    print(f"D{o['day']:>2}: {o['title']}")
    print("      " + " | ".join(o['parts'][:7]))
print("TOTAL UNIQUE DAYS:", len(seen))
