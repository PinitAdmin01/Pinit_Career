#!/usr/bin/env python3
"""
append_quant_days51_55.py
Appends Days 51 to 55 to src/lib/data/quantSystemsLongLessons.ts
"""

import json
import sys

sys.path.append('scripts')
from generate_quant_day51 import get_day_51
from generate_quant_day52 import get_day_52
from generate_quant_day53 import get_day_53
from generate_quant_day54 import get_day_54
from generate_quant_day55 import get_day_55

def clean_day(d):
    clean_parts = []
    for p in d['parts']:
        cp = {
            "title": p["title"],
            "say": p["say"],
            "example": p["example"],
            "code": p["code"],
            "output": p["output"],
            "codeNotes": p["codeNotes"],
            "tryIt": p["tryIt"],
            "check": p["check"]
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
    days = [get_day_51(), get_day_52(), get_day_53(), get_day_54(), get_day_55()]
    cleaned = [clean_day(d) for d in days]
    
    target_file = 'src/lib/data/quantSystemsLongLessons.ts'
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the closing array bracket
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in quantSystemsLongLessons.ts")
    
    # Check if Day 51 is already present
    if '"day": 51' in content:
        print("Day 51 already present in quantSystemsLongLessons.ts! Skipping append.")
        return

    json_blocks = []
    for d in cleaned:
        json_blocks.append(json.dumps(d, indent=2))
    
    appended_text = ',\n' + ',\n'.join(json_blocks) + '\n];\n'
    new_content = content[:last_bracket_idx] + appended_text
    
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully appended Days 51 to 55 to {target_file}!")

if __name__ == '__main__':
    main()
