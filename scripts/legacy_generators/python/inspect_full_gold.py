with open('scripts/build_full_block1_gold.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re
print("Days defined in build_full_block1_gold.py:")
print(re.findall(r'DAY_(\d+)\s*=', text))
print("File length:", len(text))
