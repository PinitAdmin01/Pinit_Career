import json
import re

# Update scripts/day_XX.json files first
for d in range(17, 22):
    path = f'scripts/day_{d}.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for part in data.get('parts', []):
        if 'mcq' in part:
            mcq = part['mcq']
            part['check'] = {
                'question': mcq['question'],
                'options': mcq.get('choices', mcq.get('options', [])),
                'answer': mcq.get('correctAnswer', mcq.get('answer', 0)),
                'why': mcq['why']
            }
            del part['mcq']
            
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Updated {path}")

# Now re-append or update compFundLongLessons.ts
# Let's inspect where Day 17 starts in compFundLongLessons.ts
cf_file = 'src/lib/data/compFundLongLessons.ts'
with open(cf_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Find Day 17 start
pos_d17 = text.find('// ==========================================\n// DAY 17:')
if pos_d17 == -1:
    pos_d17 = text.find('"day": 17')
    # search back for start of object
    pos_d17 = text.rfind('{\n  "day": 17', 0, pos_d17 + 20)

print(f"Found Day 17 start at position: {pos_d17}")

# Truncate text before Day 17
base_text = text[:pos_d17].rstrip()
if base_text.endswith(','):
    pass
else:
    base_text += ',\n'

# Build batch 2 json strings
batch2_parts = []
for d in range(17, 22):
    with open(f'scripts/day_{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    comment = f"// ==========================================\n// DAY {d}: {data['title']}\n// ==========================================\n"
    batch2_parts.append(comment + json_str)

new_content = base_text + '\n' + ',\n'.join(batch2_parts) + '\n];\n'

with open(cf_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Rewrote compFundLongLessons.ts with checked parts. New length: {len(new_content)}")
