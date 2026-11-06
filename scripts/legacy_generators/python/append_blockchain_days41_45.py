# -*- coding: utf-8 -*-
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day41_data import day41
from blockchain_day42_data import day42
from blockchain_day43_data import day43
from blockchain_day44_data import day44
from blockchain_day45_data import day45

days = [day41, day42, day43, day44, day45]

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

print("Successfully appended Blockchain Days 41-45 to src/lib/data/blockchainLongLessons.ts! Total days: 45")
