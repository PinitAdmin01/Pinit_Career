with open('scripts/create_dist_day33_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

namespace = {}
code = text[:text.find('assert wc >= 600')]
exec(code, namespace)
for p in namespace['parts']:
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {p['part']}: {wc} words")
