# scripts/integrate_cyber_block11.py
import json
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from cyber_day51_data import DAY_51_DATA
from cyber_day52_data import DAY_52_DATA
from cyber_day53_data import DAY_53_DATA
from cyber_day54_data import DAY_54_DATA
from cyber_day55_data import DAY_55_DATA

block11_days = [DAY_51_DATA, DAY_52_DATA, DAY_53_DATA, DAY_54_DATA, DAY_55_DATA]

file_path = "src/lib/data/cyberWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate trailing ];
idx = content.rfind("];")
if idx == -1:
    raise ValueError("Could not find trailing ]; in cyberWebLongLessons.ts")

# Format block 11 days
formatted_days = []
for day in block11_days:
    formatted_days.append(",\n" + json.dumps(day, indent=2))

new_content = content[:idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully integrated Block 11 (Days 51-55) into cyberWebLongLessons.ts!")
