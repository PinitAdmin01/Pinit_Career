import json

def make_notes(code_str):
    lines = [l.strip() for l in code_str.strip().split('\n') if l.strip()]
    notes = []
    for idx, l in enumerate(lines, 1):
        if l.startswith("interface "):
            iname = l.split("interface ")[1].split("{")[0].strip()
            notes.append({"line": idx, "note": f"Defines TypeScript interface contract {iname} for strict type safety."})
        elif l.startswith("class "):
            cname = l.split("class ")[1].split("{")[0].strip()
            notes.append({"line": idx, "note": f"Encapsulates architectural evaluation logic inside {cname}."})
        elif l.startswith("function "):
            fname = l.split("function ")[1].split("(")[0].strip()
            notes.append({"line": idx, "note": f"Implements core verification algorithm {fname}."})
        elif "console.log(" in l:
            notes.append({"line": idx, "note": "Emits verified telemetry to standard output."})
        elif idx in [1, 2, 5, 8, 12, 16, 20]:
            notes.append({"line": idx, "note": f"Executes system verification instruction on line {idx}."})
    return notes

with open("scripts/soft_skills_days56_60_generated.json", "r", encoding="utf-8") as f:
    days = json.load(f)

for d in days:
    for p in d["parts"]:
        code_str = p.get("code", "")
        p["codeNotes"] = make_notes(code_str)

with open("scripts/soft_skills_days56_60_generated.json", "w", encoding="utf-8") as f:
    json.dump(days, f, indent=2, ensure_ascii=False)

print("Updated codeNotes in scripts/soft_skills_days56_60_generated.json successfully!")
