with open('scripts/generate_block1_gold_standard.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Days defined in generate_block1_gold_standard.py:")
print(re.findall(r'DAY_(\d+)\s*=', text))
