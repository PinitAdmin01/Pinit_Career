import re

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md', 'r', encoding='utf-8') as f:
    text = f.read()

keywords = ['Branch A', 'Branch B', 'Branch C', 'branch-b', 'branch-c', 'Overall Progress', 'Curriculum Status', 'Work Remaining']
for kw in keywords:
    matches = list(re.finditer(re.escape(kw), text, re.IGNORECASE))
    print(f"Keyword '{kw}': {len(matches)} matches")
    for m in matches[:3]:
        start = max(0, m.start() - 100)
        end = min(len(text), m.end() + 300)
        snippet = text[start:end].encode('ascii', errors='replace').decode('ascii')
        print(f"--- MATCH AT {m.start()} ---")
        print(snippet)
        print()
