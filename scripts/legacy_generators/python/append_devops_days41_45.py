# scripts/append_devops_days41_45.py
import json
import os, sys

sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("scripts"))

import data_devops_day41
import data_devops_day42
import data_devops_day43
import data_devops_day44
import data_devops_day45

new_days = [
    data_devops_day41.DAY_41,
    data_devops_day42.DAY_42,
    data_devops_day43.DAY_43,
    data_devops_day44.DAY_44,
    data_devops_day45.DAY_45
]

for d in new_days:
    d['coursePrefix'] = 'devops'
    for p in d['parts']:
        p.pop('part', None)

ts_path = "src/lib/data/devopsWebLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure day 41 is not already in content
if '"day": 41' in content:
    print("Days 41-45 already present in devopsWebLongLessons.ts")
    exit(0)

# Find the closing ];
last_bracket = content.rfind("];")
if last_bracket == -1:
    raise ValueError("Could not find closing ]; in devopsWebLongLessons.ts")

before = content[:last_bracket].rstrip()
# Add comma if needed
if not before.endswith(","):
    before += ","

# Serialize new days
serialized = []
for d in new_days:
    s = json.dumps(d, indent=2)
    # Indent by 2 spaces
    s_indented = "\n".join("  " + line if line.strip() else "" for line in s.split("\n"))
    serialized.append(s_indented)

days_ts = ",\n".join(serialized)
new_content = before + "\n" + days_ts + "\n];\n"

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully appended Days 41-45 to devopsWebLongLessons.ts!")
