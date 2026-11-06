"""
Utility to sync and verify code outputs and word counts for NLP days.
"""
import importlib
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

def sync_day(day_num: int):
    mod_name = f"scripts.nlp_builder.day{day_num}"
    mod = importlib.import_module(mod_name)
    data_attr = f"DAY_{day_num}_DATA"
    day_data = getattr(mod, data_attr)
    
    parts = day_data["parts"]
    total_words = 0
    print(f"=== Syncing Day {day_num} ({len(parts)} parts) ===")
    
    for idx, p in enumerate(parts, 1):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else str(p["say"])
        words = len(say_text.split())
        total_words += words
        print(f"  Part {idx}: {words} words")
        assert words >= 600, f"Part {idx} word count {words} < 600"
        
        # Run code
        res = subprocess.run([sys.executable, "-c", p["code"]], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Execution Error in Part {idx}:\n{res.stderr}")
            sys.exit(1)
        p["output"] = res.stdout.rstrip("\r\n")
        
        # Verify check
        check = p["check"]
        assert len(check["options"]) == 4, f"Part {idx} check must have 4 options"
        assert check["answer"] == 0, f"Part {idx} answer must be 0"
        assert check["answerIndex"] == 0, f"Part {idx} answerIndex must be 0"
        assert check.get("why"), f"Part {idx} missing why"
        check["explanation"] = check["why"]
        
    print(f"Day {day_num} Total Words: {total_words} (>= 3,000 PASS)")
    assert total_words >= 3000, f"Day {day_num} total words {total_words} < 3,000"
    
    file_path = f"scripts/nlp_builder/day{day_num}.py"
    title = day_data.get("title", "")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(f'"""\nDay {day_num}: {title}\nCourse 37: Natural Language Processing & Computational Linguistics\nPinIT Career OS - Month 2 Enterprise Expansion\n"""\n\n')
        f.write(f"{data_attr} = " + json.dumps(day_data, indent=4, ensure_ascii=False) + "\n")
    print(f"Successfully synced {file_path}!\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        sync_day(int(sys.argv[1]))
    else:
        print("Usage: python scripts/nlp_builder/sync_outputs.py <day_number>")
