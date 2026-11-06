import sys
sys.path.append('scripts')
from block6_day30 import DAY_30

print("Day 30 Day:", DAY_30.get('day'))
print("Number of parts:", len(DAY_30['parts']))
word_counts = []
all_checks_ok = True
all_code_ok = True

for i, p in enumerate(DAY_30['parts']):
    wc = len(p['content'].split())
    word_counts.append(wc)
    # check keys can be 'checks' or 'conceptChecks'
    checks = p.get('checks') or p.get('conceptChecks') or []
    if len(checks) != 4:
        all_checks_ok = False
        print(f"Part {i+1} checks count mismatch: {len(checks)}")
    for c in checks:
        if c.get('answer') != 0:
            all_checks_ok = False
            print(f"Part {i+1} answer != 0: {c.get('answer')}")
        if len(c.get('options', [])) != 4:
            all_checks_ok = False
            print(f"Part {i+1} options != 4: {len(c.get('options', []))}")
        if len(c.get('explanation', '')) <= 20:
            all_checks_ok = False
            print(f"Part {i+1} explanation too short: {len(c.get('explanation', ''))}")
    code = p.get('code', '')
    if len(code) <= 50:
        all_code_ok = False
        print(f"Part {i+1} code too short: {len(code)}")

print("Word counts per part:", word_counts)
print("Total words:", sum(word_counts))
print("All >= 580:", all(wc >= 580 for wc in word_counts))
print("All checks OK (4 checks, ans 0, 4 opts, expl > 20):", all_checks_ok)
print("All code OK (> 50 chars):", all_code_ok)
