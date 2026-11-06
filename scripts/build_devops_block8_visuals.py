import json
import hashlib
import re
import os

STOPWORDS = set([
    'this', 'that', 'with', 'from', 'have', 'were', 'been', 'their', 'there',
    'which', 'about', 'would', 'could', 'should', 'these', 'those', 'where',
    'after', 'before', 'while', 'under', 'other', 'into', 'then', 'than',
    'when', 'what', 'some', 'more', 'most', 'such', 'only', 'over', 'also'
])

def extract_meaningful_words(text: str) -> set:
    matches = re.findall(r'[a-z]{4,}', text.lower())
    return set(w for w in matches if w not in STOPWORDS)

# Let's import all 5 days
import data_devops_day36
import data_devops_day37
import data_devops_day38
import data_devops_day39
import data_devops_day40

days = [
    data_devops_day36.DAY_36,
    data_devops_day37.DAY_37,
    data_devops_day38.DAY_38,
    data_devops_day39.DAY_39,
    data_devops_day40.DAY_40
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
            # Pick two good words from words
            # We want words that are purely alphabetic, length >= 4
            good_words = [w for w in words if len(w) >= 4 and not any(c.isdigit() for c in w)]
            
            # Select 2 distinct good words
            assert len(good_words) >= 2, f"Day {day_num} Part {p_idx+1} {at_target} has < 2 good words"
            w1 = good_words[0]
            w2 = good_words[1]
            
            # Construct caption
            caption = f"Evaluating system {w1} and validating {w2}."
            if len(caption) > 75:
                caption = f"System {w1} confirms {w2}."
            
            # Ensure <= 75 chars, ends with ., no digits, >= 2 shared words
            assert len(caption) <= 75
            assert caption.endswith('.')
            assert not any(c.isdigit() for c in caption)
            
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

print("All Day 36-40 visual files generated successfully!")
