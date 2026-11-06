import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day38_data import day38

# Remove \\n from commitTransition in part 2
day38['parts'][1]['code'] = day38['parts'][1]['code'].replace(
    '\"\\n\");',
    '\");'
)

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day38 = " + repr(day38) + "\n")

with open('scripts/react_day38_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Fixed Day 38 Part 2 trailing newline successfully!")
