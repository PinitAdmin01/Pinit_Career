# scripts/fix_recap_string.py
import sys
import json

for day_num in [41, 42, 43, 44, 45]:
    path = f'scripts/design_day{day_num}_data.py'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Load dictionary
    var_name = f'DAY_{day_num}'
    idx = text.find(f'{var_name} = ')
    if idx != -1:
        json_part = text[idx + len(f'{var_name} = '):]
        data = json.loads(json_part)
        if isinstance(data.get('recap'), list):
            data['recap'] = " ".join(data['recap'])
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(f'# scripts/design_day{day_num}_data.py\nimport re\n\n')
                f.write('def count_words(say_list):\n    total = 0\n    for p in say_list:\n        total += len(re.findall(r\'\\b[A-Za-z0-9_\\-\\.\\$\\/\\:\\@\\\']+\\b\', p))\n    return total\n\n')
                f.write(f'{var_name} = ' + json.dumps(data, indent=2) + '\n')
            print(f'Fixed recap in {path}')

# Now re-append Block 9 to designWebLongLessons.ts cleanly
from design_day41_data import DAY_41
from design_day42_data import DAY_42
from design_day43_data import DAY_43
from design_day44_data import DAY_44
from design_day45_data import DAY_45

with open('src/lib/data/designWebLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Cut back to day 40 end
day41_marker = '"day": 41,'
idx = content.find(day41_marker)
if idx != -1:
    # Find the object start before day 41
    brace_idx = content.rfind('{', 0, idx)
    comma_idx = content.rfind(',', 0, brace_idx)
    content = content[:comma_idx] + '\n];\n'
    print('Trimmed content back to Day 40.')

# Now append cleanly with recap as string
DAYS = [DAY_41, DAY_42, DAY_43, DAY_44, DAY_45]
last_bracket_idx = content.rfind('];')

formatted_days = []
for day in DAYS:
    day_json = json.dumps(day, indent=2)
    indented = ",\n" + "\n".join("  " + line for line in day_json.splitlines())
    formatted_days.append(indented)

new_content = content[:last_bracket_idx].rstrip() + "".join(formatted_days) + "\n];\n"

with open('src/lib/data/designWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Successfully re-appended Block 9 with string recaps!')
