import json

with open('scripts/soft_skills_days56_60_generated.json', 'r', encoding='utf-8') as f:
    days = json.load(f)

for d in days:
    for idx, p in enumerate(d['parts']):
        cn = p.get('codeNotes')
        if cn is None:
            print(f"Day {d['day']} part {idx} has codeNotes=None!")
        elif isinstance(cn, list):
            print(f"Day {d['day']} part {idx} has {len(cn)} codeNotes.")
        else:
            print(f"Day {d['day']} part {idx} has unexpected codeNotes: {type(cn)}")
