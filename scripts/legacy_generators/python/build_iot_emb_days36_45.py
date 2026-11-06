import json
import re

# Read current content which has Days 1-35
with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify where Day 35 ends
day35_match = re.search(r'day:\s*35,', content)
if not day35_match:
    raise ValueError("Day 35 not found in iotEmbLongLessons.ts")

# We want the base up to Day 35 closing brace
# Find the closing of Day 35 object
closing_pattern = r'\n\];\s*$'
match = re.search(closing_pattern, content)
if not match:
    raise ValueError("Could not find closing '];' in iotEmbLongLessons.ts")

# If content has days > 35, let's find the closing brace of day 35
# Let's inspect all 'day: X' occurrences
day_matches = list(re.finditer(r'\{\s*\n\s*day:\s*(\d+),', content))
print(f"Found {len(day_matches)} day objects in current file")

# Cut content after day 35 object
# Find day 35 object index
d35_idx = None
for i, m in enumerate(day_matches):
    if m.group(1) == '35':
        d35_idx = i
        break

if d35_idx is not None and d35_idx + 1 < len(day_matches):
    # Cut at the start of day 36 (or whatever is next)
    next_day_start = day_matches[d35_idx + 1].start()
    base_content = content[:next_day_start].rstrip().rstrip(',')
else:
    # Day 35 is the last day
    insert_pos = match.start()
    base_content = content[:insert_pos].rstrip().rstrip(',')

def escape_ts(s):
    return json.dumps(s)

def fmt_day(day_data):
    lines = []
    lines.append('  {')
    lines.append(f'    day: {day_data["day"]},')
    lines.append(f'    title: {escape_ts(day_data["title"])},')
    lines.append(f'    goal: {escape_ts(day_data["goal"])},')
    lines.append(f'    minutes: {day_data.get("minutes", 38)},')
    lines.append(f'    recap: {escape_ts(day_data["recap"])},')
    lines.append('    parts: [')
    for i, p in enumerate(day_data['parts']):
        comma_part = ',' if i < len(day_data['parts']) - 1 else ''
        lines.append('      {')
        lines.append(f'        title: {escape_ts(p["title"])},')
        lines.append('        say: [')
        for j, s in enumerate(p['say']):
            comma_say = ',' if j < len(p['say']) - 1 else ''
            lines.append(f'          {escape_ts(s)}{comma_say}')
        lines.append('        ],')
        lines.append(f'        example: {escape_ts(p["example"])},')
        c_esc = p['code'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f'        code: `{c_esc}`,')
        o_esc = p['output'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f'        output: `{o_esc}`,')
        lines.append('        codeNotes: [')
        for j, cn in enumerate(p['codeNotes']):
            comma_cn = ',' if j < len(cn if isinstance(cn, list) else p['codeNotes']) - 1 else ''
            lines.append(f'          {{ line: {cn["line"]}, note: {escape_ts(cn["note"])} }}{comma_cn}')
        lines.append('        ],')
        lines.append(f'        tryIt: {escape_ts(p["tryIt"])},')
        chk = p['check']
        lines.append('        check: {')
        lines.append(f'          question: {escape_ts(chk["question"])},')
        lines.append('          options: [')
        for j, opt in enumerate(chk['options']):
            comma_opt = ',' if j < len(chk['options']) - 1 else ''
            lines.append(f'            {escape_ts(opt)}{comma_opt}')
        lines.append('          ],')
        lines.append(f'          answer: {chk["answer"]},')
        lines.append(f'          why: {escape_ts(chk["why"])}')
        lines.append('        }')
        lines.append(f'      }}{comma_part}')
    lines.append('    ],')
    lines.append('    summary: [')
    for j, s in enumerate(day_data['summary']):
        comma_sum = ',' if j < len(day_data['summary']) - 1 else ''
        lines.append(f'      {escape_ts(s)}{comma_sum}')
    lines.append('    ],')
    ps = day_data['projectStep']
    lines.append('    projectStep: {')
    lines.append(f'      title: {escape_ts(ps["title"])},')
    lines.append('      steps: [')
    for j, st in enumerate(ps['steps']):
        comma_st = ',' if j < len(ps['steps']) - 1 else ''
        lines.append(f'        {escape_ts(st)}{comma_st}')
    lines.append('      ]')
    lines.append('    }')
    lines.append('  }')
    return '\n'.join(lines)

new_days = []
for d in range(36, 46):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        new_days.append(fmt_day(json.load(f)))

final_content = base_content + ',\n' + ',\n'.join(new_days) + '\n];\n'

with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(final_content)

print('Cleanly synthesized Days 36-45 into src/lib/data/iotEmbLongLessons.ts!')
