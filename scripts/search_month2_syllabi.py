import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

courses = ['excel', 'git', 'computer fundamentals', 'comp_fund', 'soft skills', 'communication', 'java']

for c in courses:
    print(f"\n==================== SEARCHING FOR: {c} ====================")
    # look for Day 31 or Month 2 nearby
    pattern = rf'({c}.{{0,200}}(?:Day 31|Days 31|Month 2|Month II|60-Day|60 Days))'
    matches = list(re.finditer(pattern, text, re.IGNORECASE))
    print(f"Direct proximity matches: {len(matches)}")
    for m in matches[:3]:
        snippet = text[max(0, m.start()-50):min(len(text), m.end()+200)].replace('\n', ' ')
        print("  Snippet:", snippet[:250])
