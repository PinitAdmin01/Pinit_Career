with open('scripts/soft_skills_batch6_true_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

for d in range(56, 61):
    print(f"\n{'='*70}\nALL QUESTS FOR DAY {d}\n{'='*70}")
    pos = text.find(f"Day {d}</span>")
    next_pos = text.find(f"Day {d+1}</span>") if d < 60 else text.find("5.4 Soft Skills Milestone", pos)
    if next_pos == -1:
        next_pos = pos + 9000
    chunk = text[pos:next_pos]
    
    # Extract every quest block
    q_matches = re.findall(r'<span[^>]*>(Q36\.\d+)</span>\s*<strong>([^<]+)</strong>\s*<em>\(([^)]+)\)</em>:\s*<span[^>]*>([^<]+)</span>', chunk)
    for q_id, q_title, q_type, q_desc in q_matches:
        print(f"[{q_id}] ({q_type}) {q_title}")
        print(f"    {q_desc}\n")
