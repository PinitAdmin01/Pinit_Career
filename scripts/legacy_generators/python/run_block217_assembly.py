import os
import json
import hashlib
from visual_builder import generate_workflow_visual, make_sha256

from bcom_ops_day06_builder import get_day06_data
from bcom_ops_day07_builder import get_day07_data
from bcom_ops_day08_builder import get_day08_data
from bcom_ops_day09_builder import get_day09_data
from bcom_ops_day10_builder import get_day10_data

def format_ts_string(s: str) -> str:
    # Escape backslashes, single quotes
    escaped = s.replace('\\', '\\\\').replace("'", "\\'")
    return f"'{escaped}'"

def day_to_ts(d: dict) -> str:
    lines = []
    lines.append("  {")
    lines.append(f"    coursePrefix: {format_ts_string(d['coursePrefix'])},")
    lines.append(f"    day: {d['day']},")
    lines.append(f"    title: {format_ts_string(d['title'])},")
    lines.append(f"    goal: {format_ts_string(d['goal'])},")
    lines.append(f"    minutes: {d['minutes']},")
    lines.append(f"    recap: {format_ts_string(d['recap'])},")
    lines.append("    parts: [")
    
    for p in d['parts']:
        lines.append("      {")
        lines.append(f"        title: {format_ts_string(p['title'])},")
        lines.append("        say: [")
        for para in p['say']:
            lines.append(f"          {format_ts_string(para)},")
        lines.append("        ],")
        lines.append(f"        example: {format_ts_string(p['example'])},")
        
        # Code: multiline template string
        escaped_code = p['code'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        code: `{escaped_code}`,")
        
        # Output: multiline template string
        escaped_out = p['output'].replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        lines.append(f"        output: `{escaped_out}`,")
        
        # codeNotes
        lines.append("        codeNotes: [")
        for cn in p['codeNotes']:
            lines.append(f"          {{ line: {cn['line']}, note: {format_ts_string(cn['note'])} }},")
        lines.append("        ],")
        
        # tryIt
        lines.append(f"        tryIt: {format_ts_string(p['tryIt'])},")
        
        # check
        chk = p['check']
        lines.append("        check: {")
        lines.append(f"          question: {format_ts_string(chk['question'])},")
        lines.append("          options: [")
        for opt in chk['options']:
            lines.append(f"            {format_ts_string(opt)},")
        lines.append("          ],")
        lines.append(f"          answer: {chk['answer']},")
        lines.append(f"          why: {format_ts_string(chk['why'])},")
        lines.append(f"          answerIndex: {chk['answerIndex']},")
        lines.append(f"          explanation: {format_ts_string(chk['explanation'])}")
        lines.append("        }")
        lines.append("      },")
        
    lines.append("    ],")
    
    # summary
    lines.append("    summary: [")
    for s in d['summary']:
        lines.append(f"      {format_ts_string(s)},")
    lines.append("    ],")
    
    # projectStep
    pstep = d['projectStep']
    lines.append("    projectStep: {")
    lines.append(f"      title: {format_ts_string(pstep['title'])},")
    lines.append("      steps: [")
    for st in pstep['steps']:
        lines.append(f"        {format_ts_string(st)},")
    lines.append("      ]")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

def run_assembly():
    days_data = [
        get_day06_data(),
        get_day07_data(),
        get_day08_data(),
        get_day09_data(),
        get_day10_data()
    ]
    
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_ops")
    os.makedirs(visuals_dir, exist_ok=True)
    
    # 1. Generate and save Visual JSON files
    for d in days_data:
        day_num = d['day']
        entries = []
        for p in d['parts']:
            entries.append({
                "title": p['title'],
                "code": p['code']
            })
        visual_doc = generate_workflow_visual("bcom_ops", day_num, entries)
        visual_path = os.path.join(visuals_dir, f"day-{day_num:02d}.json")
        with open(visual_path, "w", encoding="utf-8") as f:
            json.dump(visual_doc, f, indent=2, ensure_ascii=False)
        print(f"Generated Visual JSON: {visual_path} (entries={len(visual_doc['entries'])})")
        
    # 2. Append to src/lib/data/bcomOpsLongLessons.ts
    target_ts = os.path.join("src", "lib", "data", "bcomOpsLongLessons.ts")
    with open(target_ts, "r", encoding="utf-8") as f:
        existing_code = f.read()
        
    # Ensure Days 6-10 are not already present
    if "day: 6," in existing_code:
        print("WARNING: Day 6 is already present in bcomOpsLongLessons.ts! Skipping append.")
        return
        
    # Find last occurrence of "];"
    last_bracket_idx = existing_code.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in bcomOpsLongLessons.ts")
        
    ts_blocks = []
    for d in days_data:
        ts_blocks.append(day_to_ts(d))
        
    insertion = ",\n" + ",\n".join(ts_blocks) + "\n"
    new_code = existing_code[:last_bracket_idx] + insertion + existing_code[last_bracket_idx:]
    
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write(new_code)
        
    print(f"Successfully assembled Days 6-10 into {target_ts}!")

if __name__ == "__main__":
    run_assembly()
