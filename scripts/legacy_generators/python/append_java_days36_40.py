import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from day36_data import day36
from day37_data import day37
from day38_data import day38
from day39_data import day39
from day40_data import day40

days = [day36, day37, day38, day39, day40]

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

with open('src/lib/data/javaBasicsLongLessons.ts', 'r', encoding='utf-8') as f:
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

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Days 36-40 to src/lib/data/javaBasicsLongLessons.ts! Total days: 40")
