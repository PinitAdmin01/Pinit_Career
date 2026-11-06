# scripts/inspect_day57.py
import re
from pathlib import Path

text = Path('scripts/data_day57.py').read_text(encoding='utf-8')

for p in range(1, 6):
    m = re.search(rf'p{p}_code\s*=\s*[\'"]{{3}}(.*?)[\'"]{{3}}', text, re.DOTALL)
    if m:
        code = m.group(1)
        loops = [l.strip() for l in code.splitlines() if 'for ' in l and 'range' in l]
        print(f"Part {p} loops: {loops}")
