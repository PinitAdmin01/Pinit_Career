with open('docs/visuals/PINIT_MASTER_DEBUG.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Course 20 Month 2 starts at ~13057590
start = 13057500
end = 13120000
sub = text[start:end]

with open('scripts/python_block7_raw.html', 'w', encoding='utf-8') as out:
    out.write(sub)

print(f"Wrote scripts/python_block7_raw.html (length: {len(sub)})")

for day in range(31, 36):
    pattern = rf'Day\s+{day}\b'
    pos = [m.start() for m in re.finditer(pattern, sub)]
    print(f"=== DAY {day} (Matches: {len(pos)}) ===")
    if pos:
        snippet = sub[pos[0]:pos[0]+3000]
        # extract title
        m_title = re.search(r'Day\s+\d+[^<]*</span>\s*<strong[^>]*>([^<]+)</strong>', snippet)
        if m_title:
            print("  TITLE:", m_title.group(1).strip())
        
        # extract goal
        m_goal = re.search(r'Goal:</span>\s*(.*?)(?:<br>|</p>|</div>)', snippet, re.DOTALL)
        if m_goal:
            clean_goal = re.sub(r'<[^>]+>', '', m_goal.group(1)).strip()
            print("  GOAL:", clean_goal[:200])
        
        # extract quests
        quests = re.findall(r'(Q\d+\.\d+[^<]*)(?:</em>)?:\s*<span[^>]*>(.*?)</span>', snippet)
        for qid, qdesc in quests:
            clean_q = re.sub(r'<[^>]+>', '', qdesc).strip()
            print(f"    [{qid}] {clean_q[:100]}")
        
        # extract tryIt
        tryit = re.search(r'<strong>tryIt Friction:</strong>\s*(.*?)(?:<br>|</p>|</div>)', snippet, re.DOTALL)
        if tryit:
            clean_t = re.sub(r'<[^>]+>', '', tryit.group(1)).strip()
            print(f"    [tryIt] {clean_t[:150]}")
        print()
