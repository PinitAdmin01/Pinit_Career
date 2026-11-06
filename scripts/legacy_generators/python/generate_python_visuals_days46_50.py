import json
import hashlib
import os

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

out_dir = "src/lib/data/lessonVisuals/python"
os.makedirs(out_dir, exist_ok=True)

DOMAIN_STATES = {
    46: ("Protobuf Frame Packing", "HTTP/2 Multiplexing", "Async gRPC Handler", "Binary Frame Status OK"),
    47: ("Partition Hash & Batching", "Broker Log Append", "Consumer Batch Ingestion", "Manual Offset Commit"),
    48: ("Cache Key Lookup", "XFetch Probabilistic Check", "Background Pre-Warm Query", "Atomic Lua Invalidation"),
    49: ("Token Bucket Rate Check", "Bulkhead Concurrency Allocation", "Circuit State Evaluation", "Fast-Fail Fallback / Healed"),
    50: ("gRPC Gateway Multiplexing", "Kafka Event Log Dispatch", "XFetch Cache Tier Read", "Milestone 9 Certified 20k RPS")
}

for day_num in range(46, 51):
    json_path = f"scripts/python_day{day_num}.json"
    with open(json_path, "r", encoding="utf-8") as f:
        day_obj = json.load(f)
    
    st_names = DOMAIN_STATES.get(day_num, ("State 1", "State 2", "State 3", "State 4"))
    
    entries = []
    for i, p in enumerate(day_obj['parts']):
        code_h = sha256(p['code'])
        title_slug = p['title'].split(':')[0].strip()
        
        st1_name, st2_name, st3_name, st4_name = st_names
        
        entries.append({
            "partTitle": p['title'],
            "codeHash": code_h,
            "spec": {
                "template": "states",
                "title": f"{p['title']} — Python Microservice Architecture",
                "states": [
                    { "id": "st1", "label": st1_name },
                    { "id": "st2", "label": st2_name },
                    { "id": "st3", "label": st3_name },
                    { "id": "st4", "label": st4_name }
                ],
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"State 1 ({st1_name}): Initialize component pipeline for {title_slug}.",
                        "currentState": "st1",
                        "tone": "data"
                    },
                    {
                        "at": "say1",
                        "caption": f"Transition to {st2_name} verifying strict concurrency and schema contracts.",
                        "currentState": "st2",
                        "transition": { "from": "st1", "to": "st2", "label": "dispatch_pipeline()" },
                        "tone": "data"
                    },
                    {
                        "at": "example",
                        "caption": f"Transition to {st3_name} with asynchronous processing and fault isolation.",
                        "currentState": "st3",
                        "transition": { "from": "st2", "to": "st3", "label": "process_workload()" },
                        "tone": "ok"
                    },
                    {
                        "at": "tryIt",
                        "caption": f"State 4 ({st4_name}): Atomic execution verified with zero failure cascade.",
                        "currentState": "st4",
                        "transition": { "from": "st3", "to": "st4", "label": "confirm_invariant()" },
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

print("All Python visuals for Days 46-50 generated successfully!")
