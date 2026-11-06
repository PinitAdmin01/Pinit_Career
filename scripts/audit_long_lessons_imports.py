import os
import re

matches = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(root, f).replace('\\', '/')
            if p == 'src/lib/data/longLessons.ts':
                continue
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                t = fp.read()
                if re.search(r'''from\s+['"][^'"]*longLessons['"]''', t):
                    is_client = "'use client'" in t or '"use client"' in t or 'src/components/' in p
                    matches.append((p, is_client))

print(f"Total files importing longLessons: {len(matches)}")
for p, is_cl in sorted(matches):
    print(f"  {'[CLIENT BUNDLE LEAK!]' if is_cl else '[SERVER]'} : {p}")
