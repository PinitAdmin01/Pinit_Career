import json
import hashlib
import os

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

out_dir = "src/lib/data/lessonVisuals/python"
os.makedirs(out_dir, exist_ok=True)

DOMAIN_STATES = {
    56: ("Decimal Ingestion", "Double-Entry Balance Check", "Optimistic Lock Acquisition", "Immutable Audit Chain"),
    57: ("Client WebSocket Ingress", "Redis Pub/Sub Dispatch", "Frame Batch Compression", "Sequence Delta Replay"),
    58: ("Thundering Herd Ingress", "Token Bucket Rate Limiting", "Atomic Redis Lua Reservation", "Asynchronous DB Queue Drain"),
    59: ("100k RPS Capacity Modeling", "Failure Domain Isolation", "Granular Latency Budgeting", "SLO Error Budget Governance"),
    60: ("Platform Charter Validation", "Multi-Failure Red-Team Chaos", "Unified Microservices Pipeline", "Master Capstone Certification")
}

for day_num in range(56, 61):
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
                "title": f"{p['title']} — Enterprise Systems Architecture",
                "states": [
                    { "id": "st1", "label": st1_name },
                    { "id": "st2", "label": st2_name },
                    { "id": "st3", "label": st3_name },
                    { "id": "st4", "label": st4_name }
                ],
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"State 1 ({st1_name}): Initialize architecture and contracts for {title_slug}.",
                        "currentState": "st1",
                        "tone": "data"
                    },
                    {
                        "at": "say1",
                        "caption": f"Transition to {st2_name} verifying strict invariants and transactional semantics.",
                        "currentState": "st2",
                        "transition": { "from": "st1", "to": "st2", "label": "verify_transaction_invariants()" },
                        "tone": "data"
                    },
                    {
                        "at": "example",
                        "caption": f"Transition to {st3_name} with high-concurrency execution and fault isolation.",
                        "currentState": "st3",
                        "transition": { "from": "st2", "to": "st3", "label": "execute_isolated_workload()" },
                        "tone": "ok"
                    },
                    {
                        "at": "tryIt",
                        "caption": f"State 4 ({st4_name}): Production invariant verified with 100% architectural integrity.",
                        "currentState": "st4",
                        "transition": { "from": "st3", "to": "st4", "label": "certify_production_gate()" },
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

print("All Python visuals for Days 56-60 generated successfully!")
