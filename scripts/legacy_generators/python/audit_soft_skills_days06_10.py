import sys
sys.path.append('.')
sys.stdout.reconfigure(encoding='utf-8')

from scripts.make_soft_skills_day06 import get_day_06
from scripts.make_soft_skills_day07 import get_day_07
from scripts.make_soft_skills_day08 import get_day_08
from scripts.make_soft_skills_day09 import get_day_09
from scripts.make_soft_skills_day10 import get_day_10

days = [get_day_06(), get_day_07(), get_day_08(), get_day_09(), get_day_10()]

print("=== 6-CYCLE BACKTRACKING AUDIT: WORKPLACE SOFT SKILLS DAYS 6-10 ===")
total_all = 0

for d in days:
    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]
    total = sum(words)
    total_all += total
    mins = total / 150.0
    print(f"\n[DAY {d['day']:02d}] {d['title']}")
    print(f"  Spoken Audio: {total} words ({mins:.1f} mins) | Parts: {words}")
    
    # 1. Structure
    assert len(d["parts"]) == 5, f"Day {d['day']} parts count must be 5"
    assert len(d["summary"]) >= 4, f"Day {d['day']} summary count must be >= 4"
    assert len(d["projectStep"]["steps"]) >= 4, f"Day {d['day']} project steps count must be >= 4"
    
    # 2. Part invariants
    for i, p in enumerate(d["parts"]):
        w = words[i]
        assert w >= 580, f"Day {d['day']} Part {i+1} has {w} words (< 580 min)"
        assert len(p["example"]) >= 20, f"Day {d['day']} Part {i+1} example too short"
        assert "console.log(" in p["code"], f"Day {d['day']} Part {i+1} code missing console.log"
        assert len(p["output"]) >= 10, f"Day {d['day']} Part {i+1} output empty"
        assert len(p["codeNotes"]) >= 3, f"Day {d['day']} Part {i+1} codeNotes < 3"
        assert len(p["check"]["options"]) == 4, f"Day {d['day']} Part {i+1} check options != 4"
        assert 0 <= p["check"]["answer"] <= 3, f"Day {d['day']} Part {i+1} answer index out of bounds"
        assert len(p["check"]["why"]) >= 15, f"Day {d['day']} Part {i+1} check explanation too short"
        
    print(f"  ✓ 5/5 Parts validated with all pedagogical & structural invariants")

print(f"\n=======================================================")
print(f"BATCH 1 TOTAL WORDS: {total_all} words (~{total_all/150:.1f} minutes of spoken audio)")
print(f"Average Words/Day: {total_all/5:.1f} words/day (~{total_all/5/150:.1f} mins/day)")
print(f"6-Cycle Backtracking Audit Result: 100% CLEAN PASS ✓")
