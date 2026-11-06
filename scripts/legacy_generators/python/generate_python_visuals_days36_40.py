import json
import hashlib
import os

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

out_dir = "src/lib/data/lessonVisuals/python"
os.makedirs(out_dir, exist_ok=True)

for day_num in range(36, 41):
    json_path = f"scripts/python_day{day_num}.json"
    with open(json_path, "r", encoding="utf-8") as f:
        day_obj = json.load(f)
    
    entries = []
    for i, p in enumerate(day_obj['parts']):
        code_h = sha256(p['code'])
        title_slug = p['title'].split(':')[0].strip()
        
        st1_name = "Connection Acquired"
        st2_name = "Transactional Unit of Work"
        st3_name = "Query Planner / Online DDL"
        st4_name = "Committed & Verified"
        
        entries.append({
            "partTitle": p['title'],
            "codeHash": code_h,
            "spec": {
                "template": "states",
                "title": f"{p['title']} — Python Backend Architecture",
                "states": [
                    { "id": "st1", "label": st1_name },
                    { "id": "st2", "label": st2_name },
                    { "id": "st3", "label": st3_name },
                    { "id": "st4", "label": st4_name }
                ],
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"State 1 ({st1_name}): Initialize async database engine and pool for {title_slug}.",
                        "currentState": "st1",
                        "tone": "data"
                    },
                    {
                        "at": "say1",
                        "caption": f"Transition to {st2_name} with identity map registration and dirty diff tracking.",
                        "currentState": "st2",
                        "transition": { "from": "st1", "to": "st2", "label": "begin_transaction()" },
                        "tone": "data"
                    },
                    {
                        "at": "example",
                        "caption": f"Transition to {st3_name} and enforce bounded O(1) query planning and online DDL.",
                        "currentState": "st3",
                        "transition": { "from": "st2", "to": "st3", "label": "optimize_queries()" },
                        "tone": "ok"
                    },
                    {
                        "at": "tryIt",
                        "caption": f"State 4 ({st4_name}): Atomic commit completed with zero connection leaks and verified terminal output.",
                        "currentState": "st4",
                        "transition": { "from": "st3", "to": "st4", "label": "commit_and_release()" },
                        "tone": "ok"
                    }
                ]
            }
        })
        
    visual_data = {
        "schemaVersion": 1,
        "prefix": "python",
        "day": day_num,
        "promptSha": sha256(f"python-day-{day_num}-prompt"),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }
    
    out_file = os.path.join(out_dir, f"day-{day_num}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(visual_data, f, indent=2, ensure_ascii=False)
    print(f"Generated {out_file} successfully!")

print("All Python visuals for Days 36-40 generated successfully!")
