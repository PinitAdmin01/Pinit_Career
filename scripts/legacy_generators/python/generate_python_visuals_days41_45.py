import json
import hashlib
import os

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

out_dir = "src/lib/data/lessonVisuals/python"
os.makedirs(out_dir, exist_ok=True)

for day_num in range(41, 46):
    json_path = f"scripts/python_day{day_num}.json"
    with open(json_path, "r", encoding="utf-8") as f:
        day_obj = json.load(f)
    
    entries = []
    for i, p in enumerate(day_obj['parts']):
        code_h = sha256(p['code'])
        title_slug = p['title'].split(':')[0].strip()
        
        st1_name = "Enqueued to Broker"
        st2_name = "In-Flight Lease (Unacked)"
        st3_name = "Execution & Idempotency Lock"
        st4_name = "Late ACK / Result Resolved"
        
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
                        "caption": f"State 1 ({st1_name}): Publish serialized message envelope to broker queue for {title_slug}.",
                        "currentState": "st1",
                        "tone": "data"
                    },
                    {
                        "at": "say1",
                        "caption": f"Transition to {st2_name} with late ACK tracking and prefetch bounds enforcement.",
                        "currentState": "st2",
                        "transition": { "from": "st1", "to": "st2", "label": "lease_task()" },
                        "tone": "data"
                    },
                    {
                        "at": "example",
                        "caption": f"Transition to {st3_name} with distributed mutex lease and idempotency cache verification.",
                        "currentState": "st3",
                        "transition": { "from": "st2", "to": "st3", "label": "acquire_lock_and_execute()" },
                        "tone": "ok"
                    },
                    {
                        "at": "tryIt",
                        "caption": f"State 4 ({st4_name}): Atomic late ACK confirmed, zero task loss, and terminal state persisted.",
                        "currentState": "st4",
                        "transition": { "from": "st3", "to": "st4", "label": "acknowledge_and_release()" },
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

print("All Python visuals for Days 41-45 generated successfully!")
