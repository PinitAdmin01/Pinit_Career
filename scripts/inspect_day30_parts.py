import sys
sys.path.append('scripts')
from block6_day30 import DAY_30

for i, p in enumerate(DAY_30['parts']):
    print(f"=== Part {i+1}: {p['title']} ===")
    print("Word count:", len(p['content'].split()))
    print("Content preview:\n", p['content'][:300], "...\n")
