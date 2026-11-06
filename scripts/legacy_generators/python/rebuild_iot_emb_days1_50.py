import json
import re

with open('src/lib/data/iotEmbLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find Day 35 end: where Day 35 ends before whatever was appended after it
# Or find the first day after day: 35
match_d35 = re.search(r'day:\s*35,', content)
if not match_d35:
    raise ValueError("Could not find day: 35 in iotEmbLongLessons.ts")

# Find the closing brace of Day 35
# Day 35 has projectStep at the end: projectStep: { ... } }
# Let's search for projectStep after match_d35.start()
ps_match = re.search(r'projectStep:\s*\{[\s\S]*?\n\s*\}\n\s*\}', content[match_d35.start():])
if not ps_match:
    raise ValueError("Could not find projectStep closing of day 35")

d35_end_pos = match_d35.start() + ps_match.end()

base_content = content[:d35_end_pos]

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
for d in range(36, 51):
    with open(f'scripts/iot_emb_day{d}.json', 'r', encoding='utf-8') as f:
        new_days.append(fmt_day(json.load(f)))

final_content = base_content + ',\n' + ',\n'.join(new_days) + '\n];\n'

with open('src/lib/data/iotEmbLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully rebuilt src/lib/data/iotEmbLongLessons.ts with Days 1-50!")
