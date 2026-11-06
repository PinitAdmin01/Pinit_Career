import json

days = []
for d in range(56, 61):
    with open(f"scripts/python_day{d}.json", "r", encoding="utf-8") as f:
        days.append(json.load(f))

def escape_js(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

def format_part(p):
    lines = []
    lines.append("      {")
    lines.append(f"        title: {escape_js(p['title'])},")
    lines.append("        say: [")
    for s in p['say']:
        lines.append(f"          {escape_js(s)},")
    lines.append("        ],")
    if p.get('example'):
        lines.append(f"        example: {escape_js(p['example'])},")
    lines.append(f"        code: {escape_js(p['code'])},")
    lines.append(f"        output: {escape_js(p['output'])},")
    lines.append("        codeNotes: [")
    for n in p.get('codeNotes', []):
        lines.append(f"          {escape_js(n)},")
    lines.append("        ],")
    if p.get('tryIt'):
        lines.append(f"        tryIt: {escape_js(p['tryIt'])},")
    lines.append("        check: {")
    lines.append(f"          question: {escape_js(p['check']['question'])},")
    lines.append("          options: [")
    for opt in p['check']['options']:
        lines.append(f"            {escape_js(opt)},")
    lines.append("          ],")
    lines.append(f"          answer: {p['check']['answer']},")
    lines.append(f"          why: {escape_js(p['check']['why'])}")
    lines.append("        }")
    lines.append("      }")
    return "\n".join(lines)

def format_day(day):
    lines = []
    lines.append("  // ─────────────────────────────────────────────────────────────────────────────")
    lines.append(f"  // Day {day['day']}: {day['title']}")
    lines.append("  // ─────────────────────────────────────────────────────────────────────────────")
    lines.append("  {")
    lines.append(f"    day: {day['day']},")
    lines.append(f"    title: {escape_js(day['title'])},")
    lines.append(f"    goal: {escape_js(day['goal'])},")
    lines.append(f"    minutes: {day['minutes']},")
    if day.get('recap'):
        lines.append(f"    recap: {escape_js(day['recap'])},")
    lines.append("    parts: [")
    part_strs = [format_part(p) for p in day['parts']]
    lines.append(",\n".join(part_strs))
    lines.append("    ],")
    lines.append("    summary: [")
    for s in day.get('summary', []):
        lines.append(f"      {escape_js(s)},")
    lines.append("    ],")
    if day.get('projectStep'):
        lines.append("    projectStep: {")
        lines.append(f"      title: {escape_js(day['projectStep']['title'])},")
        lines.append("      steps: [")
        for st in day['projectStep'].get('steps', []):
            lines.append(f"        {escape_js(st)},")
        lines.append("      ]")
        lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

ts_days = ",\n".join(format_day(d) for d in days)

# Read pythonLongLessons.ts
target_file = "src/lib/data/pythonLongLessons.ts"
with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# Find last '];'
last_bracket = content.rfind("];")
if last_bracket == -1:
    raise ValueError("Could not find closing '];' in pythonLongLessons.ts")

# Find Day 56 if present
day56_marker = "// Day 56:"
if day56_marker in content:
    idx = content.find(day56_marker)
    prev_comma = content.rfind(",\n", 0, idx)
    new_content = content[:prev_comma] + ",\n" + ts_days + "\n" + content[last_bracket:]
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced Days 56-60 in pythonLongLessons.ts!")
else:
    new_content = content[:last_bracket] + ",\n" + ts_days + "\n" + content[last_bracket:]
    with open(target_file, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Days 56-60 to pythonLongLessons.ts!")
