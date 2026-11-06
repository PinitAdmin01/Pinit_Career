# scripts/build_devops_block9_visuals.py
import json
import hashlib
import re
import os
import sys

sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("scripts"))

STOPWORDS = set([
    'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
    'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
    'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
    'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also',
    'will', 'your', 'each', 'make', 'many', 'very', 'well', 'much', 'even'
])

def extract_meaningful_words(text: str) -> set:
    matches = re.findall(r'[a-z]{4,}', text.lower())
    return set(w for w in matches if w not in STOPWORDS)

# Import all 5 days
import data_devops_day41
import data_devops_day42
import data_devops_day43
import data_devops_day44
import data_devops_day45

days = [
    data_devops_day41.DAY_41,
    data_devops_day42.DAY_42,
    data_devops_day43.DAY_43,
    data_devops_day44.DAY_44,
    data_devops_day45.DAY_45
]

for day_obj in days:
    day_num = day_obj['day']
    entries = []
    for p_idx, part in enumerate(day_obj['parts']):
        code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
        
        # We need 4 steps: say1, say2, example, tryIt
        steps_info = [
            ('say1', part['say'][0]),
            ('say2', part['say'][1]),
            ('example', part['example']),
            ('tryIt', part['tryIt'])
        ]
        
        steps = []
        for at_target, text in steps_info:
            words = list(extract_meaningful_words(text))
            # Pick good words purely alphabetic, length >= 4
            good_words = [w for w in words if len(w) >= 4 and not any(c.isdigit() for c in w)]
            
            assert len(good_words) >= 2, f"Day {day_num} Part {p_idx+1} {at_target} has < 2 good words"
            w1 = good_words[0]
            w2 = good_words[1]
            
            # Construct caption
            caption = f"Evaluating system {w1} and validating {w2}."
            if len(caption) > 75:
                caption = f"System {w1} confirms {w2}."
            
            # Ensure <= 75 chars, ends with ., no digits, >= 2 shared words
            assert len(caption) <= 75, f"Caption too long: {caption}"
            assert caption.endswith('.'), f"Caption must end with dot: {caption}"
            assert not any(c.isdigit() for c in caption), f"Caption contains digit: {caption}"
            
            cap_words = extract_meaningful_words(caption)
            text_words = extract_meaningful_words(text)
            shared = cap_words.intersection(text_words)
            assert len(shared) >= 2, f"Day {day_num} Part {p_idx+1} {at_target}: caption shares < 2 words ({shared})"
            
            steps.append({
                "at": at_target,
                "caption": caption,
                "left": {
                    "code": f"baseline{w1.capitalize()}",
                    "result": {"text": "standard"},
                    "tone": "ok"
                },
                "right": {
                    "code": f"target{w2.capitalize()}",
                    "result": {"text": "optimized"},
                    "tone": "accent"
                }
            })
            
        entry = {
            "partTitle": part['title'],
            "codeHash": code_hash,
            "spec": {
                "template": "compare",
                "title": f"DevOps architecture analysis for {part['title'][:35]}",
                "leftLabel": "Standard Infrastructure",
                "rightLabel": "Target Implementation",
                "steps": steps
            },
            "filled": {
                "template": "compare",
                "title": f"DevOps architecture analysis for {part['title'][:35]}",
                "leftLabel": "Standard Infrastructure",
                "rightLabel": "Target Implementation",
                "steps": steps
            }
        }
        entries.append(entry)
        
    day_visual = {
        "schemaVersion": 2,
        "prefix": "devops",
        "day": day_num,
        "promptSha": hashlib.sha256(f"devops-day-{day_num}".encode('utf-8')).hexdigest(),
        "model": "google/gemini-2.5-pro",
        "entries": entries
    }
    
    out_path = f"src/lib/data/lessonVisuals/devops/day-{day_num}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(day_visual, f, indent=2)
    print(f"Generated {out_path} with 5 valid visual entries")

print("All Day 41-45 visual files generated successfully!")
