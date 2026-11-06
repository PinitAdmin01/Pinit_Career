import json
import re

def escape_ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)

def format_day_ts(day_data: dict) -> str:
    lines = []
    lines.append("  {")
    lines.append(f"    day: {day_data['day']},")
    lines.append(f"    title: {escape_ts_string(day_data['title'])},")
    lines.append(f"    goal: {escape_ts_string(day_data['goal'])},")
    lines.append(f"    minutes: {day_data.get('minutes', 36)},")
    lines.append(f"    recap: {escape_ts_string(day_data['recap'])},")
    lines.append("    parts: [")
    
    for i, p in enumerate(day_data['parts']):
        comma_part = "," if i < len(day_data['parts']) - 1 else ""
        lines.append("      {")
        lines.append(f"        title: {escape_ts_string(p['title'])},")
        lines.append("        say: [")
        for j, s in enumerate(p['say']):
            comma_say = "," if j < len(p['say']) - 1 else ""
            lines.append(f"          {escape_ts_string(s)}{comma_say}")
        lines.append("        ],")
        lines.append(f"        example: {escape_ts_string(p['example'])},")
        
        code_escaped = p['code'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        code: `{code_escaped}`,")
        
        out_escaped = p['output'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        output: `{out_escaped}`,")
        
        lines.append("        codeNotes: [")
        for j, cn in enumerate(p['codeNotes']):
            comma_cn = "," if j < len(p['codeNotes']) - 1 else ""
            lines.append(f"          {{ line: {cn['line']}, note: {escape_ts_string(cn['note'])} }}{comma_cn}")
        lines.append("        ],")
        
        lines.append(f"        tryIt: {escape_ts_string(p['tryIt'])},")
        
        chk = p['check']
        lines.append("        check: {")
        lines.append(f"          question: {escape_ts_string(chk['question'])},")
        lines.append("          options: [")
        for j, opt in enumerate(chk['options']):
            comma_opt = "," if j < len(chk['options']) - 1 else ""
            lines.append(f"            {escape_ts_string(opt)}{comma_opt}")
        lines.append("          ],")
        lines.append(f"          answer: {chk['answer']},")
        lines.append(f"          why: {escape_ts_string(chk['why'])}")
        lines.append("        }")
        lines.append(f"      }}{comma_part}")
        
    lines.append("    ],")
    lines.append("    summary: [")
    for j, s in enumerate(day_data['summary']):
        comma_sum = "," if j < len(day_data['summary']) - 1 else ""
        lines.append(f"      {escape_ts_string(s)}{comma_sum}")
    lines.append("    ],")
    
    ps = day_data['projectStep']
    lines.append("    projectStep: {")
    lines.append(f"      title: {escape_ts_string(ps['title'])},")
    lines.append("      steps: [")
    for j, st in enumerate(ps['steps']):
        comma_st = "," if j < len(ps['steps']) - 1 else ""
        lines.append(f"        {escape_ts_string(st)}{comma_st}")
    lines.append("      ]")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

def main():
    target_file = "src/lib/data/iotEmbLongLessons.ts"
    with open(target_file, "r", encoding="utf-8") as f:
        content = f.read()

    closing_pattern = r"\n\];\s*$"
    match = re.search(closing_pattern, content)
    if not match:
        raise ValueError("Could not find closing `];` in iotEmbLongLessons.ts")

    insert_pos = match.start()

    new_days_ts = []
    for d in range(16, 21):
        with open(f"scripts/iot_emb_day{d}.json", "r", encoding="utf-8") as f:
            day_data = json.load(f)
        new_days_ts.append(format_day_ts(day_data))

    separator = ",\n"
    combined_new_content = separator.join(new_days_ts)

    updated_content = content[:insert_pos] + ",\n" + combined_new_content + "\n];\n"

    with open(target_file, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print("Appended Days 16-20 to src/lib/data/iotEmbLongLessons.ts successfully!")

if __name__ == "__main__":
    main()
