import sys
sys.path.append("scripts")
from make_git_vcs_day25 import make_day25

d = make_day25()
for i, p in enumerate(d["parts"]):
    print(f"Part {i+1}: {len(p['say'])} items")
    for j, s in enumerate(p["say"]):
        print(f"  Item {j+1}: {len(s.split())} words | {s[:60]}...")
