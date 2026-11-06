# scripts/dump_block9_snippets.py
import json
import sys, os
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("scripts"))

snippets = []
for day_num in range(41, 46):
    mod = __import__(f"data_devops_day{day_num}")
    day_obj = getattr(mod, f"DAY_{day_num}")
    for p_idx, part in enumerate(day_obj["parts"]):
        snippets.append({
            "day": day_num,
            "part": p_idx + 1,
            "title": part["title"],
            "code": part["code"],
            "expectedOutput": part["output"]
        })

with open("scripts/devops_days41_45_snippets.json", "w", encoding="utf-8") as f:
    json.dump(snippets, f, indent=2)

print(f"Dumped {len(snippets)} snippets to scripts/devops_days41_45_snippets.json")
