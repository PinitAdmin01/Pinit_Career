import json
import data_devops_day36
import data_devops_day37
import data_devops_day38
import data_devops_day39
import data_devops_day40

new_days = [
    data_devops_day36.DAY_36,
    data_devops_day37.DAY_37,
    data_devops_day38.DAY_38,
    data_devops_day39.DAY_39,
    data_devops_day40.DAY_40
]

for d in new_days:
    d['coursePrefix'] = 'devops'
    for p in d['parts']:
        p.pop('part', None)

ts_path = "src/lib/data/devopsWebLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure day 36 is not already in content
if '"day": 36' in content:
    print("Days 36-40 already present in devopsWebLongLessons.ts")
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

print("Successfully appended Days 36-40 to devopsWebLongLessons.ts!")
