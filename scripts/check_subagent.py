import json

agents = [
    ("AIT Architect", "27f950f7-a5ad-494f-bfff-2f7e8c84adc5"),
    ("NLP Architect", "1f61259d-6e10-4258-969d-828579f086ac")
]

for name, cid in agents:
    path = rf'C:\Users\Admin\.gemini\antigravity\brain\{cid}\.system_generated\logs\transcript.jsonl'
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        print(f"\n=== {name} ({cid[:8]}...): {len(lines)} steps ===")
        for line in lines[-4:]:
            obj = json.loads(line)
            step_idx = obj.get('step_index')
            stype = obj.get('type')
            status = obj.get('status')
            created = obj.get('created_at')
            print(f"Step {step_idx}: {stype} ({status}) at {created}")
            if 'tool_calls' in obj:
                for tc in obj['tool_calls']:
                    print(f"   Tool: {tc.get('name')} {tc.get('args', {}).get('toolSummary', '')}")
    except Exception as e:
        print(f"Error reading {name}:", e)
