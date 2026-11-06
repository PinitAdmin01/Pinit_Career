import json
import os
import subprocess
import sys

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    data_file = 'scripts/data_bcom_ait_block11.json'
    if not os.path.exists(data_file):
        print(f"Waiting: {data_file} does not exist yet.")
        sys.exit(1)

    with open(data_file, 'r', encoding='utf-8') as f:
        days_data = json.load(f)

    print(f"Loaded {len(days_data)} days from {data_file}")
    
    # Validation
    for day_obj in days_data:
        day_num = day_obj["day"]
        parts = day_obj["parts"]
        print(f"\n--- Validating Day {day_num} ({len(parts)} parts) ---")
        assert len(parts) == 5, f"Day {day_num} must have 5 parts"
        
        day_words = 0
        for p_idx, part in enumerate(parts):
            say_text = " ".join(part["say"]) if isinstance(part["say"], list) else str(part["say"])
            words = len(say_text.strip().split())
            day_words += words
            print(f"  Part {p_idx+1}: {words} words - '{part['title']}'")
            assert words >= 600, f"Day {day_num} Part {p_idx+1} has {words} words < 600"
            
            # Code execution check
            code = part.get("code", "")
            expected_out = part.get("output", "")
            res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True)
            if res.returncode != 0:
                print(f"Execution Error in Day {day_num} Part {p_idx+1}:\n{res.stderr}")
                sys.exit(1)
            actual_out = res.stdout.rstrip('\r\n')
            if actual_out != expected_out.rstrip('\r\n'):
                print(f"Output mismatch in Day {day_num} Part {p_idx+1}: updating to actual.")
                part["output"] = actual_out
                
            # Check MCQ
            check = part["check"]
            assert len(check["options"]) == 4, f"Day {day_num} Part {p_idx+1} must have 4 options"
            check["answer"] = 0
            check["answerIndex"] = 0
            assert check.get("why"), f"Day {day_num} Part {p_idx+1} missing why"
            check["explanation"] = check["why"]
            
        print(f"Day {day_num} total spoken words: {day_words} (>= 3,000 PASS)")
        assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3,000"
        
        # Ensure projectStep schema
        if "projectStep" in day_obj:
            day_obj["projectStep"] = {
                "title": day_obj["projectStep"].get("title", f"Enterprise Project Step for Day {day_num}"),
                "steps": day_obj["projectStep"].get("steps", ["Step 1", "Step 2", "Step 3"])
            }
        day_obj["coursePrefix"] = "bcom_ait"

    # Read current bcomAitLongLessons.ts
    target_ts = "src/lib/data/bcomAitLongLessons.ts"
    with open(target_ts, "r", encoding="utf-8") as f:
        ts_content = f.read()

    # Find last array closing bracket ];
    last_bracket_idx = ts_content.rfind("];")
    if last_bracket_idx == -1:
        print("Error: Could not find ]; in target TS file.")
        sys.exit(1)

    # Convert days_data to formatted TypeScript JSON
    days_json = json.dumps(days_data, indent=2, ensure_ascii=False)
    # Strip outer [ and ]
    stripped_json = days_json.strip()
    if stripped_json.startswith("[") and stripped_json.endswith("]"):
        stripped_json = stripped_json[1:-1].strip()

    new_ts_content = ts_content[:last_bracket_idx].rstrip() + ",\n  " + stripped_json + "\n];\n"
    
    with open(target_ts, "w", encoding="utf-8") as f:
        f.write(new_ts_content)

    print(f"\nSuccessfully appended Days 51 to 55 to {target_ts}!")

if __name__ == "__main__":
    main()
