# -*- coding: utf-8 -*-
"""
Append Days 51 to 55 to src/lib/data/blockchainLongLessons.ts.
Course 7: Blockchain Architecture, Web3 & Smart Contracts (Month 2 Batch 5).
"""

import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day51_data import day51
from blockchain_day52_data import day52
from blockchain_day53_data import day53
from blockchain_day54_data import day54
from blockchain_day55_data import day55

days = [day51, day52, day53, day54, day55]

def clean_surrogates(obj):
    if isinstance(obj, str):
        try:
            return obj.encode('utf-16', 'surrogatepass').decode('utf-16')
        except Exception:
            return obj
    elif isinstance(obj, list):
        return [clean_surrogates(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_surrogates(v) for k, v in obj.items()}
    return obj

cleaned_days = [clean_surrogates(d) for d in days]

with open('src/lib/data/blockchainLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

stripped = content.rstrip()
if not stripped.endswith('];'):
    raise ValueError("File does not end with '];'")

cutoff_index = stripped.rfind('];')
base_content = stripped[:cutoff_index].rstrip()

if not base_content.endswith(','):
    base_content += ','

day_strings = []
for d in cleaned_days:
    day_strings.append(json.dumps(d, indent=2, ensure_ascii=False))

new_content = base_content + '\n  ' + ',\n  '.join(day_strings) + '\n];\n'

with open('src/lib/data/blockchainLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Blockchain Days 51-55 to src/lib/data/blockchainLongLessons.ts! Total days: 55 (91.7% complete)")
