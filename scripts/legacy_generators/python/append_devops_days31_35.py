import json
from data_devops_day31 import DAY_31
from data_devops_day32 import DAY_32
from data_devops_day33 import DAY_33
from data_devops_day34 import DAY_34
from data_devops_day35 import DAY_35

ALL_NEW_DAYS = [DAY_31, DAY_32, DAY_33, DAY_34, DAY_35]

with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

last_bracket = content.rfind('];')
if last_bracket == -1:
    raise ValueError("Could not find closing '];' in devopsWebLongLessons.ts")

# Format each day
formatted_days = []
for day_obj in ALL_NEW_DAYS:
    # Ensure day_obj has coursePrefix: 'devops'
    day_obj['coursePrefix'] = 'devops'
    for p in day_obj['parts']:
        p.pop('part', None)
    dumped = json.dumps(day_obj, indent=2)
    # indent each line by 2 spaces
    indented = '\n'.join('  ' + line if line else line for line in dumped.splitlines())
    formatted_days.append(indented)

new_content = content[:last_bracket].rstrip() + ',\n' + ',\n'.join(formatted_days) + '\n];\n'

with open('src/lib/data/devopsWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully appended Days 31 to 35 to devopsWebLongLessons.ts! Total file size: {len(new_content)} bytes")
