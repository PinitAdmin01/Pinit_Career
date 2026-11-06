import glob
import re

files = glob.glob('src/lib/data/*.ts') + glob.glob('src/app/quests/**/*.ts*')
print(f"Searching {len(files)} files for Day 2 return issues...")

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            text = fp.read()
            # Look for day 2 test or quest with return
            matches = re.finditer(r'(?:day[-_\s]*2|day\":\s*2).*?return', text, re.IGNORECASE | re.DOTALL)
            for m in matches:
                snippet = m.group(0)
                if len(snippet) < 300:
                    print(f"\n[MATCH in {f}]:")
                    print(snippet)
    except Exception as e:
        pass
