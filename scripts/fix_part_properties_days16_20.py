import os, sys, json
sys.path.append('.')

for day_num in range(16, 21):
    mod_name = f"scripts.make_soft_skills_day{day_num}"
    fn_name = f"get_day_{day_num}"
    
    # Import module dynamically
    import importlib
    mod = importlib.import_module(mod_name)
    getter = getattr(mod, fn_name)
    day_obj = getter()
    
    for part in day_obj["parts"]:
        # 1. Rename lineNotes -> codeNotes if present
        if "lineNotes" in part:
            part["codeNotes"] = part.pop("lineNotes")
            
        # 2. Remove part-level explanation if present
        if "explanation" in part:
            part.pop("explanation")
            
    # Write back
    file_path = f"scripts/make_soft_skills_day{day_num}.py"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f"import json\n\ndef get_day_{day_num}():\n    return " + json.dumps(day_obj, indent=4) + "\n")
    print(f"Updated Day {day_num}: codeNotes ensured and explanation removed.")

print("All Days 16-20 files cleanly standardized!")
