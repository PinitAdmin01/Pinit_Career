import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day39_data import day39

day39['parts'][1]['code'] = day39['parts'][1]['code'].replace(
    "benchmarkStrategies('High-End Desktop (8ms compute)', 8);\n\n// Scenario B",
    "benchmarkStrategies('High-End Desktop (8ms compute)', 8);\nconsole.log('');\n// Scenario B"
)

output_py = []
output_py.append("import hashlib\n")
output_py.append("import json\n\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day39 = " + repr(day39) + "\n")

with open('scripts/react_day39_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Successfully updated Day 39 Part 2 code!")
