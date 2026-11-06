import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

pos18 = text.find('Course 18: Edge AI')
for d in range(6, 11):
    m = re.search(rf'>Day\s+{d}</span>\s*<strong[^>]*>([^<]+)</strong>', text[pos18:])
    if m:
        start_idx = pos18 + m.start()
        card_snippet = text[start_idx:start_idx+3500]
        print(f"=== DAY {d}: {m.group(1).strip()} ===")
        parts = re.findall(r'<span class="part-pill">Part\s+(\d+)</span>\s*<strong>([^<]+)</strong>:\s*([^<\n]+)', card_snippet)
        for pnum, ptitle, pdesc in parts:
            print(f"  Part {pnum}: {ptitle} -> {pdesc.strip()[:65]}")
