import re

with open('src/lib/data/compFundLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'([^\.\n]*and verified its core production invariant[^\.\n]*\.)', re.IGNORECASE)
matches = pattern.findall(text)

print(f"Total sentence matches: {len(matches)}")
for i, m in enumerate(matches[:5]):
    print(f"\n--- MATCH {i+1} ---")
    print(m.strip()[:200])
