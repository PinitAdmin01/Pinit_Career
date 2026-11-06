import os
import sys
import json
import hashlib

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "scripts"))

from visual_builder import generate_workflow_visual, make_sha256

from scripts.bcom_ops_day16_builder import get_day16_data
from scripts.bcom_ops_day17_builder import get_day17_data
from scripts.bcom_ops_day18_builder import get_day18_data
from scripts.bcom_ops_day19_builder import get_day19_data
from scripts.bcom_ops_day20_builder import get_day20_data

def format_ts_string(s: str) -> str:
    escaped = s.replace('\\', '\\\\').replace("'", "\\'")
    return f"'{escaped}'"

def adapt_day_data(d: dict) -> dict:
    d['coursePrefix'] = d.get('coursePrefix', 'bcom_ops')
    
    for p in d['parts']:
        if isinstance(p.get('tryIt'), dict):
            t_dict = p['tryIt']
            p['tryIt'] = t_dict['description']
            if 'check' in p:
                p['check']['answerIndex'] = p['check'].get('answer', 0)
                p['check']['explanation'] = p['check'].get('why', '')
            else:
                p['check'] = {
                    'question': t_dict['question'],
                    'options': t_dict['options'],
                    'answer': t_dict['answer'],
                    'why': t_dict['explanation'],
                    'answerIndex': t_dict['answer'],
                    'explanation': t_dict['explanation']
                }
        elif 'check' in p:
            p['check']['answerIndex'] = p['check'].get('answer', 0)
            p['check']['explanation'] = p['check'].get('why', '')
            
    return d

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

def run_block219_assembly():
    raw_days = [
        get_day16_data(),
        get_day17_data(),
        get_day18_data(),
        get_day19_data(),
        get_day20_data()
    ]
    
    days_data = [adapt_day_data(d) for d in raw_days]
    
    visuals_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_ops")
    os.makedirs(visuals_dir, exist_ok=True)
    
    # 1. Generate and save Visual JSON files with SHA-256 bindings
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
        
    if "day: 16," in existing_code:
        print("WARNING: Day 16 is already present in bcomOpsLongLessons.ts! Skipping append.")
        return
        
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
        
    print(f"Successfully assembled Days 16-20 (Block 219) into {target_ts}!")

if __name__ == "__main__":
    run_block219_assembly()
