#!/usr/bin/env python3
"""
append_quant_days56_60.py
Appends Days 56 to 60 to src/lib/data/quantSystemsLongLessons.ts
"""

import json

def clean_day(d):
    clean_parts = []
    for p in d['parts']:
        cp = {
            "title": p["title"],
            "say": p["say"],
            "example": p["example"],
            "code": p["code"],
            "output": p.get("output", ""),
            "codeNotes": p.get("codeNotes", []),
            "tryIt": p.get("tryIt", ""),
            "check": p.get("check", {})
        }
        clean_parts.append(cp)
    return {
        "day": d["day"],
        "title": d["title"],
        "goal": d["goal"],
        "minutes": d["minutes"],
        "recap": d["recap"],
        "parts": clean_parts,
        "summary": d["summary"],
        "projectStep": d["projectStep"]
    }

def main():
    days = []
    for day in range(56, 61):
        with open(f'scripts/quant_day{day}.json', 'r', encoding='utf-8') as f:
            days.append(json.load(f))
    
    cleaned = [clean_day(d) for d in days]
    
    target_file = 'src/lib/data/quantSystemsLongLessons.ts'
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the closing array bracket
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in quantSystemsLongLessons.ts")
    
    # Check if Day 56 is already present
    if '"day": 56' in content:
        print("Day 56 already present in quantSystemsLongLessons.ts! Skipping append.")
        return

    json_blocks = []
    for d in cleaned:
        json_blocks.append(json.dumps(d, indent=2))
    
    appended_text = ',\n' + ',\n'.join(json_blocks) + '\n];\n'
    new_content = content[:last_bracket_idx] + appended_text
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully appended Days 56 to 60 to {target_file}!")

if __name__ == '__main__':
    main()
