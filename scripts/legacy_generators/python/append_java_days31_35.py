import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from day31_data import d31
from day32_data import day32
from day33_data import day33
from day34_data import day34
from day35_data import day35

days = [d31, day32, day33, day34, day35]

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

# Verify that the file ends with "];\n" or "];"
stripped = content.rstrip()
if not stripped.endswith('];'):
    raise ValueError("File does not end with '];'")

# Cut off the trailing "];"
cutoff_index = stripped.rfind('];')
base_content = stripped[:cutoff_index].rstrip()

# Ensure there is a comma after the last day (day 30)
if not base_content.endswith(','):
    base_content += ','

# Format each day nicely as JSON
day_strings = []
for d in cleaned_days:
    day_strings.append(json.dumps(d, indent=2, ensure_ascii=False))

new_content = base_content + '\n  ' + ',\n  '.join(day_strings) + '\n];\n'

with open('src/lib/data/javaBasicsLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully appended Days 31-35 to src/lib/data/javaBasicsLongLessons.ts! Total days: 35")
