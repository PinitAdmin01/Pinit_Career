# -*- coding: utf-8 -*-
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from mobile_day56_data import day56
from mobile_day57_data import day57
from mobile_day58_data import day58
from mobile_day59_data import day59
from mobile_day60_data import day60

days = [day56, day57, day58, day59, day60]

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

with open('src/lib/data/mobileLongLessons.ts', 'r', encoding='utf-8') as f:
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

with open('src/lib/data/mobileLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Mobile Days 56-60 to src/lib/data/mobileLongLessons.ts! Total days: 60 (100% Complete!)")
