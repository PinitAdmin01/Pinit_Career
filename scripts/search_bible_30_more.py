import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

terms = ['30 more', '30 lessons', '60 days', '60-day', 'Month 2', 'Month-2', 'second month', '697']
for term in terms:
    matches = [m.start() for m in re.finditer(re.escape(term), text, re.IGNORECASE)]
    print(f"Term '{term}': {len(matches)} matches")
    for m in matches[:3]:
        print("  Snippet:", text[max(0, m-40):min(len(text), m+160)].replace('\n', ' '))
