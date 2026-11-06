import sys
sys.path.insert(0, '.')

with open('scripts/day57_builder.py', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'from typing import List, Dict, Tuple, Optional\\n',
    'from typing import List, Dict, Tuple, Optional, Any\\n'
)

text = text.replace('assert words >= 600', '# assert words >= 600')
text = text.replace('assert total_words >= 3000', '# assert total_words >= 3000')

with open('scripts/day57_builder_test.py', 'w', encoding='utf-8') as f:
    f.write(text)

import scripts.day57_builder_test as b
d = b.build_day57()
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1} ('{p['title']}'): {wc} words | Output length: {len(p.get('output', ''))}")
