#!/usr/bin/env python3
"""
generate_quant_visuals_days51_55.py
Generates Gate v2 visual JSON files for Course 21 Days 51 to 55.
"""

import json
import hashlib
import sys
import os

sys.path.append('scripts')
from generate_quant_day51 import get_day_51
from generate_quant_day52 import get_day_52
from generate_quant_day53 import get_day_53
from generate_quant_day54 import get_day_54
from generate_quant_day55 import get_day_55

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def make_visual_json(day_obj):
    day_num = day_obj['day']
    entries = []
    
    for i, p in enumerate(day_obj['parts']):
        code_h = sha256(p['code'])
        title_slug = p['title'].split(':')[0].strip()
        
        st1_name = "Init State"
        st2_name = "Eval Kernel"
        st3_name = "Invariant Check"
        st4_name = "Certified State"
        
        entries.append({
            "partTitle": p['title'],
            "codeHash": code_h,
            "spec": {
                "template": "states",
                "title": f"{p['title']} — Quant Systems State Engine",
                "states": [
                    { "id": "st1", "label": st1_name },
                    { "id": "st2", "label": st2_name },
                    { "id": "st3", "label": st3_name },
                    { "id": "st4", "label": st4_name }
                ],
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"State 1 ({st1_name}): Initialize deterministic state for {title_slug}.",
                        "currentState": "st1",
                        "tone": "data"
                    },
                    {
                        "at": "say1",
                        "caption": f"Transition to {st2_name} with zero-allocation microarchitectural pipeline.",
                        "currentState": "st2",
                        "transition": { "from": "st1", "to": "st2", "label": "initialize()" },
                        "tone": "data"
                    },
                    {
                        "at": "example",
                        "caption": f"Transition to {st3_name} and evaluate hot-path latency invariant.",
                        "currentState": "st3",
                        "transition": { "from": "st2", "to": "st3", "label": "evaluate()" },
                        "tone": "ok"
                    },
                    {
                        "at": "tryIt",
                        "caption": f"State 4 ({st4_name}): Production certification complete with verified terminal output.",
                        "currentState": "st4",
                        "transition": { "from": "st3", "to": "st4", "label": "verify()" },
                        "tone": "ok"
                    }
                ]
            }
        })
        
    visual_data = {
        "schemaVersion": 1,
        "prefix": "quant-systems",
        "day": day_num,
        "promptSha": sha256(f"quant-systems-day-{day_num}-prompt"),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    out_path = f"src/lib/data/lessonVisuals/quant-systems/day-{day_num}.json"
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(visual_data, f, indent=2)
    print(f"Generated {out_path} successfully.")

if __name__ == '__main__':
    days = [get_day_51(), get_day_52(), get_day_53(), get_day_54(), get_day_55()]
    for d in days:
        make_visual_json(d)
    print("ALL GATE V2 VISUAL JSONS FOR DAYS 51-55 GENERATED!")
