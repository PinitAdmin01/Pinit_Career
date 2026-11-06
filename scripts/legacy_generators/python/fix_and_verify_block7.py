# scripts/fix_and_verify_block7.py
import json
import subprocess

for d in range(31, 36):
    file_path = f"scripts/iot_net_day{d}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
    
    modified = False
    for p_idx, part in enumerate(day_data["parts"]):
        # Fix check object if needed
        check = part.get("check", {})
        if "answer" not in check and "answerIndex" in check:
            check["answer"] = check["answerIndex"]
            modified = True
        elif "answer" not in check:
            check["answer"] = 0
            modified = True

        # Run code and verify/sync output
        code = part["code"]
        res = subprocess.run(["python", "-c", code], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"ERROR: Day {d} Part {p_idx+1} code failed to run:")
            print(res.stderr)
            raise RuntimeError(f"Day {d} Part {p_idx+1} code failed")
        
        actual_output = res.stdout.replace("\r\n", "\n")
        stored_output = part.get("output", "").replace("\r\n", "\n")
        
        if actual_output.strip() != stored_output.strip():
            print(f"Updating output for Day {d} Part {p_idx+1}")
            part["output"] = actual_output
            modified = True
            
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(day_data, f, indent=2)
        print(f"Saved updates to {file_path}")

print("All individual day files verified and synced!")
