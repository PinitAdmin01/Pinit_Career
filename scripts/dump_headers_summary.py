with open('scripts/soft_skills_batch6_true_bible.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re

output_lines = []
for d in range(56, 61):
    output_lines.append(f"\n{'='*70}\nHEADER & TRYIT FOR DAY {d}\n{'='*70}")
    pos = text.find(f"Day {d}</span>")
    next_pos = text.find(f"Day {d+1}</span>") if d < 60 else text.find("5.4 Soft Skills Milestone", pos)
    chunk = text[pos:next_pos]
    
    clean_chunk = re.sub(r'<[^>]+>', ' ', chunk)
    clean_chunk = re.sub(r'\s+', ' ', clean_chunk).strip()
    q_idx = clean_chunk.find("Quests Scheduled")
    if q_idx != -1:
        output_lines.append(clean_chunk[:q_idx])
    else:
        output_lines.append(clean_chunk[:1000])

with open('scripts/soft_skills_batch6_headers_summary.txt', 'w', encoding='utf-8') as out:
    out.write("\n".join(output_lines))

print("Wrote headers summary to scripts/soft_skills_batch6_headers_summary.txt")
