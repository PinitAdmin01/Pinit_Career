import json

def clean_day(d):
    clean_parts = []
    for p in d['parts']:
        cp = {
            "title": p["title"],
            "say": p["say"],
            "example": p["example"],
            "code": p["code"],
            "output": p.get("output", ""),
            "codeNotes": p.get("codeNotes", []),
            "tryIt": p.get("tryIt", ""),
            "check": p.get("check", {})
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

target_file = 'src/lib/data/quantSystemsLongLessons.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find Day 56 start
day56_marker = '"day": 56'
pos56 = content.find(day56_marker)
if pos56 == -1:
    # try day: 56
    pos56 = content.find('day: 56')

if pos56 != -1:
    # Find the opening brace before Day 56
    brace_idx = content.rfind('{\n    "day": 56', 0, pos56 + 20)
    if brace_idx == -1:
        brace_idx = content.rfind('{', 0, pos56)
    # Find preceding comma
    comma_idx = content.rfind(',', 0, brace_idx)
    cut_point = comma_idx
    print(f"Cutting at {cut_point}")
    base_content = content[:cut_point]
else:
    # Not yet present, cut before closing ];
    last_bracket = content.rfind('];')
    base_content = content[:last_bracket]

days = []
for day in range(56, 61):
    with open(f'scripts/quant_day{day}.json', 'r', encoding='utf-8') as f:
        days.append(json.load(f))

cleaned = [clean_day(d) for d in days]
json_blocks = [json.dumps(d, indent=2) for d in cleaned]
appended_text = ',\n' + ',\n'.join(json_blocks) + '\n];\n'

new_content = base_content + appended_text
with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully re-appended Days 56 to 60 with array say to {target_file}!")
